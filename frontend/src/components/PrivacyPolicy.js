import React from 'react';
import '../styles/PrivacyPolicy.css';

const PrivacyPolicy = () => {

  return (
    <div className="privacy-container">
        <div className="nav-space"></div>
        <form className="privacy-policy-form">
            <h2 style={{textAlign: 'center'}}>QuizMe Privacy Policy</h2>
            <p>
                QuizMe, Inc. is dedicated to helping people around the world practice and master whatever they are learning. 
                When you share information with us we can help you achieve that goal by helping you find the right content and making your studying quicker and more effective.
                This Privacy Notice is meant to help you understand how we collect and use the personal information you provide when you use our Service, including through our website and mobile applications. 
                This notice explains:
               <ul>
                    <li>
                        The information we collect and where we collect it from
                    </li>
                    <li> 
                        The ways we use your information
                    </li>
                    <li>
                        The times where we might need to share information
                    </li>
                    <li>
                        Choices you have about what we do and how to exercise your choices
                    </li>
                    <li>
                        How to contact us if you have questions
                    </li>
               </ul>
            </p>
            <h3>Information We Collect and Sources</h3>
            <p>
                We need to collect certain information about you to provide you with the Service or the support you request. The type of information we collect can vary depending on how you access and use our Service.
                Additionally, you can choose to voluntarily provide information to us. Below we have described the types of information we collect and from where we collect it.
            </p>
            <h4>Information you Provide to Us to Use the Service</h4>
            <p>
               Account information. We collect the information you provide when you sign up for a QuizMe account, log in to your account, communicate with us, answer our surveys, upload content, or otherwise use the Services.
               We request an email address and date of birth when you choose to sign up for the Service so we can provide the Services to you and allow us to comply with applicable regulations.
               Without this information, we are not be able to provide you with the Service.
            </p>
            <p>
                Transactional information. Users who engage in financial transactions with QuizMe, for example to purchase an upgraded membership subscription, are 
                asked to provide additional information in order to complete the transaction, such as a credit card number, billing address and full name.
            </p>
            <p>
                Visitors can always refrain from supplying certain information, but it may prevent them from engaging in certain QuizMe services which require that information.
            </p>
            <h4>Information You Provide to Enhance Your Experience</h4>
            <p>
                You can choose to provide us with additional information in order to obtain a better user experience when using the Service.
                This additional information will be processed with your consent and/or to provide you with services you request.
                This information includes your survey responses, participation in contests, promotions or other marketing efforts, suggestions for improvements, 
                referrals, or any other actions on the Service.
            </p>
            <h4>Information We Get Automatically When You Use the Service</h4>
            <p>
                We automatically collect information about you and how you use the Service, like when you create a study set, join a class, or view and interact with
                your or other users' content. This information we collect includes:
            </p>
            <p>
                Device information. Like most website operators, QuizMe collects information about how users visit our site and the devices they use. 
                We collect device-specific information (such as your hardware model, operating system version, device identifiers like IDFA and UDID, and mobile network information). 
                QuizMe may associate your device identifiers or other device information with your QuizMe Account to help us provide consistent services across your devices.
            </p>
            <p>
                Geolocation information. We may use your IP address to generate a general approximation of where you are located in order to provide you with an improved
                experience. We do not request access to or collect location sensor information, such as GPS or Bluetooth beacons, from your mobile device while downloading
                or using our mobile apps or services.
            </p>
            <p>
            Log information. When you use QuizMe, we automatically collect and store certain information about this activity. This data includes details of how you 
            used our service, like your search queries, clicks and site navigation information, or study activity. It also may include data such as:
            </p>
                <ul>
                    <li>
                        Browser type
                    </li>
                    <li> 
                        Language preference and time zone
                    </li>
                    <li>
                        Referring site, and the date and time of each visitor request
                    </li>
                    <li>
                        Connection information like ISP or mobile operator
                    </li>
                    <li>
                        Internet Protocol (IP) address
                    </li>
                    <li>
                        Log-in and Log-out times
                    </li>
               </ul>
            <h3>How We Use Your Information</h3>
            <p>
                We collect information about you when you use the Service for a variety of reasons in order to support QuizMe and to enable our team to continue to create
                engaging experiences for our users.
            </p>
            <h4>Providing, Analyzing, Improving and Developing the Service</h4>
            <p>
                We process the data we collect about you to operate, improve and develop the QuizMe Service, including providing, maintaining, securing and improving our
                services, developing new ones, and protecting QuizMe and our users. We are able to deliver our services, personalize content, and make suggestions for you by
                using this information to understand how you use and interact with our services. We conduct surveys and research, test features in development, and analyze the
                information we have to evaluate and improve products and services, develop new products or features, and conduct audits and troubleshooting activities.
            </p>
            <p>
                Here are some examples of how we use this information:
            </p>
                <ul>
                    <li>
                        Providing, maintaining and improving the Service. Account information we collect from you allows us to help you log in, host your content, and use the
                        various study tools we have. It also allows us learn about how you and others use QuizMe to help create new activities and services, like QuizMe Live.
                    </li>
                    <li> 
                        Improving, personalizing and facilitating your use of the Service. When you sign up and use a QuizMe account, we may associate certain information with
                        your new account, such as information about other QuizMe accounts you had or currently have, and your prior usage of the Service. For example, we use
                        information collected from cookies and other technologies, like pixel tags, to save your language preferences, so we will be able to have our services
                        appear in the language you prefer. We do this in order to ensure that content from the Service is presented in the most effective manner for you.
                    </li>
                    <li>
                        Measuring, tracking and analyzing trends and usage in connection with your use or the performance of the Service. In order to develop and enhance our
                        products and deliver a consistent, secure and continuous experience, we need gather certain information to analyze usage and performance of the Service.
                        We also use mobile analytics software to pursue our legitimate interests in operating and improving QuizMe by allowing us to better understand the
                        functionality of our mobile software on your device. This software may record information such as how often you use the application, the events and
                        activities that occur within the application, aggregated usage, performance data, and where the application was downloaded from.
                    </li>
                    <li>
                        Fulfilling any other purpose disclosed to you in connection with the Service.
                    </li>
               </ul>
      </form>
    </div>
  );
};

export default PrivacyPolicy;
