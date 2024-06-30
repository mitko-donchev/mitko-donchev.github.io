import React, { useState, useEffect } from "react";
import styled from "styled-components";
import emailjs from "emailjs-com";

// Assets
import ContactImg1 from "../../assets/img/contact-1.png";
import ContactImg2 from "../../assets/img/contact-2.png";
import ContactImg3 from "../../assets/img/contact-3.png";

export default function Contact() {
  const [formData, setFormData] = useState({
    fname: "",
    email: "",
    subject: "",
    message: ""
  });

  const [formErrors, setFormErrors] = useState({
    fname: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submissionStatus, setSubmissionStatus] = useState({
    success: false,
    message: "",
    ticketId: null
  });

  const [recaptchaToken, setRecaptchaToken] = useState("");

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(process.env.REACT_APP_RECAPTCHA_KEY, { action: "submit" }).then((token) => {
            setRecaptchaToken(token);
          });
        });
      }
    };

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_KEY}`;
    script.async = true;
    script.onload = loadRecaptcha;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
    // Clear validation error when user starts typing in the field
    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation
    let errors = {};
    if (!formData.fname.trim()) {
      errors.fname = "First name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Do not submit the form if there are errors
    }

    // Generate a random 10-digit ticket ID
    const ticketId = generateTicketId();

    debugger;

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      setSubmissionStatus({
        success: false,
        message: "Failed to verify reCAPTCHA.",
        ticketId: null
      });
      return;
    }

    // EmailJS integration
    try {
      const result = await emailjs.send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        {
          from_name: formData.fname,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          ticket_id: ticketId
        },
        process.env.REACT_APP_USER_ID
      );
      console.log(result.text);
      setSubmissionStatus({
        success: true,
        message: `Thank you for your interest. Your email is received and we will get back to you as soon as possible.`,
        ticketId: ticketId
      });
    } catch (error) {
      console.log(error.text);
      setSubmissionStatus({
        success: false,
        message: "An error occurred while sending the email.",
        ticketId: null
      });
    }
  };

  // Function to validate email format (example)
  const isValidEmail = (email) => {
    // Basic email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Function to generate a random 10-digit number
  const generateTicketId = () => {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  };

  return (
    <Wrapper id="contact">
      <div className="lightBg">
        <div className="container">
          <HeaderInfo>
            <h1 className="font40 extraBold">Let's get in touch</h1>
            <p className="font13">
              Have questions or ready to start your project? Reach out to us! We're here to discuss your ideas,
              <br />
              provide insights, and offer solutions tailored to your needs.
            </p>
          </HeaderInfo>
          <div className="row" style={{ paddingBottom: "30px" }}>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              {submissionStatus.success ? (
                <SuccessMessage>
                  {submissionStatus.message}
                </SuccessMessage>
              ) : (
                <StyledForm onSubmit={handleSubmit}>
                  <Label htmlFor="fname" className="font13">
                    First name:
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      value={formData.fname}
                      onChange={handleChange}
                      className="font20 extraBold"
                    />
                    {formErrors.fname && <ErrorMessage>{formErrors.fname}</ErrorMessage>}
                  </Label>
                  <Label htmlFor="email" className="font13">
                    Email:
                    <Input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="font20 extraBold"
                    />
                    {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
                  </Label>
                  <Label htmlFor="subject" className="font13">
                    Subject:
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="font20 extraBold"
                    />
                    {formErrors.subject && <ErrorMessage>{formErrors.subject}</ErrorMessage>}
                  </Label>
                  <Label htmlFor="message" className="font13">
                    Message:
                    <Textarea
                      rows="4"
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="font20 extraBold"
                    />
                    {formErrors.message && <ErrorMessage>{formErrors.message}</ErrorMessage>}
                  </Label>
                  <SubmitWrapper className="flex">
                    <Buttoninput type="submit" value="Send Message" className="pointer animate radius8" style={{ maxWidth: "220px" }} />
                  </SubmitWrapper>

                </StyledForm>
              )}
            </div>
            {/* <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 flex">
              <div style={{ width: "50%" }} className="flexNullCenter flexColumn">
                <ContactImgBox>
                  <img src={ContactImg1} alt="office" className="radius6" />
                </ContactImgBox>
                <ContactImgBox>
                  <img src={ContactImg2} alt="office" className="radius6" />
                </ContactImgBox>
              </div>
              <div style={{ width: "50%" }}>
                <div style={{ marginTop: "100px" }}>
                  <img src={ContactImg3} alt="office" className="radius6" />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

// Styled components
const Wrapper = styled.section`
  width: 100%;
`;

const HeaderInfo = styled.div`
  padding: 70px 0 30px 0;
  @media (max-width: 860px) {
    text-align: center;
  }
`;

const StyledForm = styled.form`
  padding: 70px 0 30px 0;
  input,
  textarea {
    width: 100%;
    background-color: transparent;
    border: 0px;
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid #707070;
    height: 30px;
    margin-bottom: 30px;
  }
  textarea {
    min-height: 100px;
  }
  @media (max-width: 860px) {
    padding: 30px 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  text-color:black;
  font-size: 20px;
  margin-top: 5px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  font-size: 20px;
  margin-top: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  font-size: 18px;
  color: green;
  font-weight: bold;
  padding: 20px;
  border: 1px solid green;
  border-radius: 5px;
  background-color: #e0f7e0;
  text-align: center;
`;

const ContactImgBox = styled.div`
  max-width: 180px;
  align-self: flex-end;
  margin: 10px 30px 10px 0;
`;

const SubmitWrapper = styled.div`
  @media (max-width: 991px) {
    width: 100%;
    margin-bottom: 50px;
  }
`;

const Buttoninput = styled.input`
  border: 1px solid #7620ff !important;
  background-color: #7620ff !important;
  width: 100% !important;
  padding: 15px !important;
  outline: none !important;
  text-align: center !important;
  line-height: 0.1 !important;
  color: #fff !important;
  :hover {
    background-color: #580cd2 !important;
    border: 1px solid #7620ff !important;
    color: #fff !important;
  }
  @media (max-width: 991px) {
    margin: 0 auto !important;
  }
`;