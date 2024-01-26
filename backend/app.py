"""Import necessary modules for luxapp.py"""
from dotenv import load_dotenv

load_dotenv()

import pymysql
import os
from flask import Flask, jsonify, request, session, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_session import Session
from database import *
from config import ApplicationConfig
from uuid import uuid4
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
import ast
from sqlalchemy import func

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)

# server_session = Session(app)
# Flask-session is currently incompatible with Flask version 3.0.0
# thus we currently have client-side sessions (there is a fix that we may implement depending on time)

mail = Mail(app)
db = SQLAlchemy(app)
CORS(app)

def get_uuid():
    return uuid4().hex

def generate_token(email):
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    return serializer.dumps(email, salt=app.config["SECURITY_PASSWORD_SALT"])


def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    try:
        email = serializer.loads(
            token, salt=app.config["SECURITY_PASSWORD_SALT"], max_age=expiration
        )
        return email
    except Exception:
        return False

def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        sender=app.config["MAIL_DEFAULT_SENDER"],
    )
    mail.send(msg)

def string_to_list(input_string):
    try:
        # Safely evaluate the string representation of a list
        result_list = ast.literal_eval(input_string)
        if isinstance(result_list, list):
            return result_list
        else:
            raise ValueError("Invalid input: Not a list")
    except (ValueError, SyntaxError) as e:
        print(f"Error: {e}")
        return None

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    is_confirmed = db.Column(db.Boolean, nullable=False, default=False)

class Deck(db.Model):
    __tablename__ = 'decks'

    deck_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

class Card(db.Model):
    __tablename__ = 'cards'

    card_id = db.Column(db.Integer, primary_key=True)
    deck_id = db.Column(db.Integer, db.ForeignKey('decks.deck_id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

class UserProgress(db.Model):
    __tablename__ = 'user_progress'

    user_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), primary_key=True)
    deck_id = db.Column(db.Integer, db.ForeignKey('decks.deck_id'), primary_key=True)
    score = db.Column(db.Integer)
    last_completed = db.Column(db.TIMESTAMP)

class Tag(db.Model):
    __tablename__ = 'tags'

    tag_id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(255), nullable=False)

class DeckTag(db.Model):
    __tablename__ = 'deck_tags'

    deck_id = db.Column(db.Integer, db.ForeignKey('decks.deck_id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), primary_key=True)

class CardTag(db.Model):
    __tablename__ = 'card_tags'

    card_id = db.Column(db.Integer, db.ForeignKey('cards.card_id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), primary_key=True)

class FavoriteDeck(db.Model):
    __tablename__ = 'favorite_decks'

    user_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), primary_key=True)
    deck_id = db.Column(db.Integer, db.ForeignKey('decks.deck_id'), primary_key=True)
    creator_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), primary_key=True)

class RecentDeck(db.Model):
    __tablename__ = 'recent_decks'

    insertion_order = db.Column(db.Integer)
    user_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), primary_key=True)
    deck_id = db.Column(db.Integer, db.ForeignKey('decks.deck_id'), primary_key=True)
    creator_id = db.Column(db.String(32), db.ForeignKey('users.user_id'), primary_key=True)

@app.route('/')
@app.route('/users', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_users():
    users = User.query.all()
    return jsonify([{'user_id': user.user_id, 'username': user.username, 'email': user.email} for user in users])

@app.route('/@me')
@cross_origin(supports_credentials=True)
def get_current_user():
    user_id = session.get("user_id")

    user = User.query.filter_by(user_id=user_id).first()

    if not user:
        return jsonify({'message': 'Not logged in'}), 200

    response_data = {
        'message': 'Logged in',
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'is_confirmed': user.is_confirmed,
        'username' : user.username
    }

    return jsonify(response_data), 200

@app.route('/profile/<userId>')
@cross_origin(supports_credentials=True)
def profile(userId):
    user = User.query.filter_by(user_id=userId).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    response_data = {
        'message': 'User found',
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'is_confirmed': user.is_confirmed
    }

    return jsonify(response_data), 200


@app.route('/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_user():
    data = request.get_json()

    user_exists = User.query.filter_by(email=data['email']).first() is not None

    if user_exists:
        return jsonify({'message': 'Email already in use.'}), 200

    username_exists = User.query.filter_by(username=data['username']).first() is not None

    if username_exists:
        return jsonify({'message': 'Username is already taken. Please choose another.'}), 200

    hashed_password = bcrypt.generate_password_hash(data['password'])

    new_user = User(username=data['username'], password_hash=hashed_password, email=data['email'])
    db.session.add(new_user)
    db.session.commit()

    response_data = {
        'message': 'User created successfully',
        'user_id': new_user.user_id,
        'email': new_user.email
    }

    token = generate_token(new_user.email)
    confirm_url = url_for("confirm_email", token=token, _external=True)
    html = render_template("confirm_email.html", confirm_url=confirm_url)
    subject = "Please confirm your email"
    send_email(new_user.email, subject, html)

    return jsonify(response_data), 201

@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login_user():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if user is None:
        return jsonify({'message': 'Username or password is incorrect'}), 200

    if not bcrypt.check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Username or password is incorrect'}), 200

    session["user_id"] = user.user_id

    if not user.is_confirmed:

        response_data = {
            'message': 'Account has not been authenticated',
        }

        return jsonify(response_data), 200

    response_data = {
        'message': 'Logged in successfully',
    }

    return jsonify(response_data), 200

@app.route('/logout')
@cross_origin(supports_credentials=True)
def logout():
    session.pop("user_id", None)

    response_data = {
        'message': 'Logged out successfully',
    }

    return jsonify(response_data), 200

@app.route('/deleteuser')
@cross_origin(supports_credentials=True)
def delete_user():
    try:
        user_id = session.get("user_id")

        user = User.query.filter_by(user_id=user_id).first()

        db.session.delete(user)
        db.session.commit()

        response_data = {
            'message': 'Account deleted successfully',
        }

        session.pop("user_id", None)

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/confirm/<token>")
def confirm_email(token):
    email = confirm_token(token)

    user = User.query.filter_by(email=email).first()

    if not user:
        text = "The confirmation link is invalid or has expired. Login/Signup to generate a new one."
        return render_template("verification.html", text=text)

    if user.is_confirmed:
        text = "You are already registered. You can login with your account."
        return render_template("verification.html", text=text)

    user.is_confirmed = True
    db.session.add(user)
    db.session.commit()

    text = "You are registered! You can now login with your account."

    return render_template("verification.html", text=text)

@app.route("/resend")
@cross_origin(supports_credentials=True)
def resend_confirmation():
    user_id = session.get("user_id")
    current_user = User.query.filter_by(user_id=user_id).first()

    if not current_user:
        return jsonify({'message': 'Login to resend confirmation'}), 200

    if current_user.is_confirmed:
        return jsonify({'message': 'Your account has already been confirmed'}), 200

    token = generate_token(current_user.email)

    confirm_url = url_for("confirm_email", token=token, _external=True)
    html = render_template("confirm_email.html", confirm_url=confirm_url)
    subject = "Please confirm your email"
    send_email(current_user.email, subject, html)

    return jsonify({'message': 'A new confirmation email has been sent'}), 200


@app.route('/decks', methods=['GET'])
def get_decks():
    try:
        decks = Deck.query.all()
        decks_data = []
        for deck in decks:
            cards = Card.query.filter_by(deck_id=deck.deck_id).all()
            user = User.query.get(deck.user_id)
            decks_data.append({
                'deck_id': deck.deck_id,
                'title': deck.title,
                'description': deck.description,
                'numTerms': len(cards),  # Number of cards in the deck
                'user': user.username if user else None  # Username of the deck creator
            })
        return jsonify(decks_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/decks', methods=['POST'])
@cross_origin()
def create_deck():
    data = request.get_json()
    new_deck = Deck(user_id=data['user_id'], title=data['title'], description=data['description'])
    db.session.add(new_deck)
    db.session.commit()

    # Fetch the deck_id after committing the new deck
    deck_id = new_deck.deck_id

    # Include deck_id in the response
    response_data = {
        'message': 'Deck created successfully',
        'deck_id': deck_id
    }

    return jsonify(response_data), 201

@app.route('/decks/<int:deck_id>', methods=['GET'])
def get_deck_with_cards(deck_id):
    try:
        # Query the Deck table for the deck with the given ID
        deck = Deck.query.filter_by(deck_id=deck_id).first()
        if deck:
            # Query the Card table for cards associated with the deck
            cards = Card.query.filter_by(deck_id=deck_id).all()

            # Serialize the deck and card data
            user = User.query.get(deck.user_id)
            deck_data = {
                'deck_id': deck.deck_id,
                'title': deck.title,
                'description': deck.description,
                'user_id': user.user_id,
                'user': user.username if user else None,
                'cards': [{'card_id': card.card_id, 'question': card.question, 'answer': card.answer} for card in cards]
            }
            return jsonify(deck_data)
        else:
            return jsonify({"error": "Deck not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/decks/<int:deck_id>', methods=['PUT'])
def update_deck(deck_id):
    try:
        data = request.get_json()
        deck = Deck.query.get(deck_id)
        if not deck:
            return jsonify({"error": "Deck not found"}), 404

        deck.title = data.get('title', deck.title)
        deck.description = data.get('description', deck.description)
        db.session.commit()
        return jsonify({'message': 'Deck updated successfully'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/cards/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    data = request.get_json()
    card = Card.query.get(card_id)
    if not card:
        return jsonify({"error": "Card not found"}), 404

    card.question = data.get('question', card.question)
    card.answer = data.get('answer', card.answer)
    db.session.commit()
    return jsonify({'message': 'Card updated successfully'}), 200

@app.route('/cards/delete', methods=['POST'])
@cross_origin()
def delete_cards():
    data = request.get_json()
    card_ids = data['card_ids']
    try:
        for card_id in card_ids:
            card = Card.query.get(card_id)
            if card:
                db.session.delete(card)
        db.session.commit()
        return jsonify({'message': 'Cards deleted successfully'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/cards', methods=['GET'])
def get_cards():
    cards = Card.query.all()
    return jsonify([{'card_id': card.card_id, 'question': card.question, 'answer': card.answer} for card in cards])

@app.route('/cards', methods=['POST'])
@cross_origin()
def create_card():
    data = request.get_json()
    new_card = Card(deck_id=data['deck_id'], question=data['question'], answer=data['answer'])
    db.session.add(new_card)
    db.session.commit()
    return jsonify({'message': 'Card created successfully'}), 201

@app.route('/user_progress', methods=['GET'])
def get_user_progress():
    progress = UserProgress.query.all()
    return jsonify([{'user_id': p.user_id, 'deck_id': p.deck_id, 'score': p.score} for p in progress])

@app.route('/user_progress', methods=['POST'])
@cross_origin()
def create_user_progress():
    data = request.get_json()
    new_progress = UserProgress(user_id=data['user_id'], deck_id=data['deck_id'], score=data['score'])
    db.session.add(new_progress)
    db.session.commit()
    return jsonify({'message': 'User progress created successfully'}), 201

@app.route('/tags', methods=['GET'])
def get_tags():
    tags = Tag.query.all()
    return jsonify([{'tag_id': tag.tag_id, 'tag_name': tag.tag_name} for tag in tags])

@app.route('/tags', methods=['POST'])
@cross_origin()
def create_tag():
    data = request.get_json()
    new_tag = Tag(tag_name=data['tag_name'])
    db.session.add(new_tag)
    db.session.commit()
    return jsonify({'message': 'Tag created successfully'}), 201

@app.route('/decktags', methods=['GET'])
def get_decktags():
    decktags = DeckTag.query.all()
    return jsonify([{'deck_id': dt.deck_id, 'tag_id': dt.tag_id} for dt in decktags])

@app.route('/decktags', methods=['POST'])
@cross_origin()
def create_decktag():
    data = request.get_json()
    new_decktag = DeckTag(deck_id=data['deck_id'], tag_id=data['tag_id'])
    db.session.add(new_decktag)
    db.session.commit()
    return jsonify({'message': 'DeckTag created successfully'}), 201

@app.route('/cardtags', methods=['GET'])
def get_cardtags():
    cardtags = CardTag.query.all()
    return jsonify([{'card_id': ct.card_id, 'tag_id': ct.tag_id} for ct in cardtags])

@app.route('/cardtags', methods=['POST'])
@cross_origin()
def create_cardtag():
    data = request.get_json()
    new_cardtag = CardTag(card_id=data['card_id'], tag_id=data['tag_id'])
    db.session.add(new_cardtag)
    db.session.commit()
    return jsonify({'message': 'CardTag created successfully'}), 201

@app.route('/favoritedecks/<user_id>', methods=['GET'])
def get_user_favoritedecks(user_id):
    favoritedecks = FavoriteDeck.query.filter_by(user_id=user_id, ).all()
    return jsonify([{'deck_id': fd.deck_id} for fd in favoritedecks])

@app.route('/isfavorited', methods=['POST'])
@cross_origin(supports_credentials=True)
def is_favorited():
    try:
        data = request.get_json()
        user_id = session.get('user_id')
        favorited = FavoriteDeck.query.filter_by(user_id=user_id, deck_id=data['deck_id']).first() is not None
        response_data = {
            'message': 'Got favorited state',
            'isFavorited': favorited
        }
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/getfavorites', methods=['POST'])
@cross_origin(supports_credentials=True)
def get_favorited():
    try:
        data = request.get_json()
        user_id = session.get('user_id')
        favorites = FavoriteDeck.query.filter_by(user_id=user_id).all()
        print(favorites)
        decks_data = []
        for fdeck in favorites:
            deck = Deck.query.filter_by(deck_id=fdeck.deck_id).first()
            cards = Card.query.filter_by(deck_id=deck.deck_id).all()
            user = User.query.get(deck.user_id)
            decks_data.append({
                'deck_id': deck.deck_id,
                'title': deck.title,
                'description': deck.description,
                'numTerms': len(cards),  # Number of cards in the deck
                'user': user.username if user else None  # Username of the deck creator
            })

        response_data = {
            'message': 'Got favorite decks',
            'decks': decks_data
        }
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/favoritedecks', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_favoritedeck():
    data = request.get_json()
    user_id = session.get('user_id')
    deck = Deck.query.filter_by(deck_id=data['deck_id']).first()

    favorite_deck = FavoriteDeck.query.filter_by(user_id=user_id, deck_id=deck.deck_id).first()

    if favorite_deck:
        # If favorite already exists, remove it (toggle off)
        db.session.delete(favorite_deck)
        message = 'Removed from favorites'
    else:
        # If not favorited yet, add to favorites (toggle on)
        new_favorite = FavoriteDeck(user_id=user_id, deck_id=deck.deck_id, creator_id=deck.user_id)
        db.session.add(new_favorite)
        message = 'Added to favorites'

    db.session.commit()
    return jsonify({'message': message}), 200

@app.route('/updaterecents', methods=['POST'])
@cross_origin(supports_credentials=True)
def update_recents():
    data = request.get_json()
    user_id = session.get("user_id")
    deck_id = data['deck_id']

    deck = Deck.query.filter_by(deck_id=deck_id).first()

    if deck is None:
        return jsonify({'message': 'no deck'}), 200

    recent_exists = RecentDeck.query.filter_by(deck_id=deck_id, user_id=user_id).first()
    if recent_exists is not None:
        db.session.delete(recent_exists)
        db.session.commit()

    new_recent = RecentDeck(user_id=user_id, deck_id=deck.deck_id, creator_id=deck.user_id)

    db.session.add(new_recent)

    num_recents = len(RecentDeck.query.filter_by(user_id=user_id).all())

    if num_recents > 12:
        to_delete = RecentDeck.query.filter_by(user_id=user_id).first()
        db.session.delete(to_delete)
    db.session.commit()
    return jsonify({'message': 'recents updated'}), 200

@app.route('/recents')
@cross_origin(supports_credentials=True)
def get_recents():
    try:
        user_id = session.get("user_id")
        current_user = User.query.filter_by(user_id=user_id).first()
        decks_data = []
        recents = RecentDeck.query.filter_by(user_id=user_id).order_by(RecentDeck.insertion_order).all()[::-1]
        for recent_deck in recents:
            deck = Deck.query.filter_by(deck_id=recent_deck.deck_id).first()
            cards = Card.query.filter_by(deck_id=deck.deck_id).all()
            user = User.query.get(deck.user_id)
            decks_data.append({
                'deck_id': deck.deck_id,
                'title': deck.title,
                'description': deck.description,
                'numTerms': len(cards),  # Number of cards in the deck
                'user': user.username if user else None  # Username of the deck creator
            })

        response_data = {
            'message': 'Got recents',
            'decks': decks_data,
            'is_confirmed': current_user.is_confirmed
        }
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/userdecks', methods=['POST'])
@cross_origin(supports_credentials=True)
def get_user_decks():
    try:
        data = request.get_json()
        decks = Deck.query.filter_by(user_id=data['user_id']).all()
        decks_data = []
        for deck in decks:
            cards = Card.query.filter_by(deck_id=deck.deck_id).all()
            user = User.query.get(deck.user_id)
            decks_data.append({
                'deck_id': deck.deck_id,
                'title': deck.title,
                'description': deck.description,
                'numTerms': len(cards),  # Number of cards in the deck
                'user': user.username if user else None  # Username of the deck creator
            })

        response_data = {
            'message': 'Got user decks',
            'decks': decks_data
        }
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/popularcreators', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_popular_creators():
    try:
        # Use SQLAlchemy to query and count the occurrences of creator_ids
        top_creators = db.session.query(
            FavoriteDeck.creator_id,
            func.count(FavoriteDeck.creator_id).label('count')
        ).group_by(FavoriteDeck.creator_id).order_by(func.count(FavoriteDeck.creator_id).desc()).limit(12).all()

        user_data = []
        # Format the result into a dictionary
        for creator_id, count in top_creators:
            user = User.query.get(creator_id)
            user_data.append({
                'username': user.username,
                'user_id': user.user_id,
                'numFavorites': str(count) + ' favorited deck(s)',  # Number of cards in the deck
            })

        response_data = {
            'message': 'Got popular creators',
            'users': user_data,
        }

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/populardecks', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_popular_decks():
    try:
        # Use SQLAlchemy to query and count the occurrences of deck_ids
        top_decks = db.session.query(
            FavoriteDeck.deck_id,
            func.count(FavoriteDeck.deck_id).label('count')
        ).group_by(FavoriteDeck.deck_id).order_by(func.count(FavoriteDeck.deck_id).desc()).limit(12).all()

        deck_data = []
        # Format the result into a dictionary
        for deck_id, count in top_decks:
            deck = Deck.query.get(deck_id)
            user = User.query.get(deck.user_id)
            cards = Card.query.filter_by(deck_id=deck.deck_id).all()
            deck_data.append({
                'deck_id': deck.deck_id,
                'title': deck.title,
                'description': deck.description,
                'numTerms': len(cards),
                'numFavorites': str(count) + ' favorite(s)',  # Number of cards in the deck
                'user': user.username if user else None  # Username of the deck creator
            })

        response_data = {
            'message': 'Got popular decks',
            'decks': deck_data,
        }

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/popularcards', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_popular_cards():
    try:
        cards = Card.query.order_by(func.random()).limit(5).all()

        card_data = []
        # Format the result into a dictionary
        for card in cards:
            card_data.append({
                'deck_id': card.deck_id,
                'question': card.question,
                'answer': card.answer
            })

        response_data = {
            'message': 'Got popular cards',
            'cards': card_data,
        }

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search', methods=['GET'])
@cross_origin(supports_credentials=True)
def search_decks():
    query = request.args.get('query', '')
    try:
        # Assuming you want to search in Deck titles
        matching_decks = Deck.query.filter(Deck.title.ilike(f'%{query}%')).all()
        decks_data = []
        for deck in matching_decks:
            # Fetch cards associated with the deck
            cards = Card.query.filter_by(deck_id=deck.deck_id).all()

            # Prepare data for each card
            card_data = [
                {'card_id': card.card_id, 'question': card.question, 'answer': card.answer}
                for card in cards
            ]

            # Add deck information including card data
            decks_data.append({
                'deck_id': deck.deck_id,
                'title': deck.title,
                'description': deck.description,
                'numTerms': len(card_data),  # Number of cards in the deck
                'user': User.query.get(deck.user_id).username if User.query.get(deck.user_id) else None, # Username of the deck creator
                'cards': card_data  # Include card details for the preview
            })

        return jsonify(decks_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/decks/<int:deck_id>', methods=['DELETE'])
def delete_deck(deck_id):
    try:
        deck = Deck.query.get(deck_id)
        if not deck:
            return jsonify({"error": "Deck not found"}), 404

        # Delete associated cards first
        Card.query.filter_by(deck_id=deck_id).delete()

        # Now delete the deck
        db.session.delete(deck)
        db.session.commit()
        return jsonify({'message': 'Deck deleted successfully'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug = True)