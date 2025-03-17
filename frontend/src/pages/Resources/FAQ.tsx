import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: "Who can donate blood?",
      answer: "Most healthy adults who are at least 17 years old (16 in some states with parental consent), weigh at least 110 pounds, and are in good health can donate blood. Eligibility requirements may vary by location and blood center."
    },
    {
      question: "How often can I donate blood?",
      answer: "You can donate whole blood every 56 days (8 weeks). If you donate platelets, you can give every 7 days up to 24 times a year. Plasma donors can donate every 28 days, and double red cell donors can give every 112 days."
    },
    {
      question: "How long does the blood donation process take?",
      answer: "The entire process takes about one hour, though the actual blood donation only takes about 8-10 minutes. The process includes registration, a brief health screening, the donation itself, and a short recovery period with refreshments."
    },
    {
      question: "Is donating blood safe?",
      answer: "Yes, donating blood is very safe. All equipment used is sterile and disposed of after a single use. The average adult has about 10 pints of blood, and only about 1 pint is taken during a donation, which your body quickly replaces."
    },
    {
      question: "What should I do before donating blood?",
      answer: "Before donating, make sure you're well-hydrated, have eaten a healthy meal, get a good night's sleep, and avoid fatty foods. Wear comfortable clothing with sleeves that can be rolled up. Bring a list of medications you're taking and a valid ID."
    },
    {
      question: "What happens to my blood after I donate?",
      answer: "After donation, your blood is tested for infectious diseases and processed into components (red cells, platelets, plasma). These components are stored appropriately and distributed to hospitals where they're used for patients in need."
    },
    {
      question: "Will donating blood hurt?",
      answer: "Most donors feel only a brief sting when the needle is inserted. The actual donation process is usually painless, though some people may experience mild discomfort. Staff are trained to make the experience as comfortable as possible."
    },
    {
      question: "Can I donate if I have a medical condition or take medication?",
      answer: "It depends on the condition and medication. Many people with controlled medical conditions can donate. During the screening process, medical professionals will evaluate your eligibility based on your specific situation."
    },
    {
      question: "What blood types are most needed?",
      answer: "All blood types are needed, but O negative (universal donor) and O positive are in high demand. AB plasma is also valuable as it can be given to patients of any blood type. Type-specific needs may vary based on local patient populations."
    },
    {
      question: "How long does donated blood last?",
      answer: "Red blood cells can be stored for up to 42 days, platelets for only 5 days, and plasma can be frozen and stored for up to one year. This is why regular donations are crucial to maintain adequate blood supplies."
    }
  ];

  return (
    <div className="container page-content">
      <div className="page-header">
        <h1>Blood Donation FAQ</h1>
        <p>Find answers to commonly asked questions about blood donation.</p>
      </div>

      <div className="faq-container">
        {faqItems.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <div 
              className="faq-question" 
              onClick={() => toggleFAQ(index)}
            >
              <h3>{item.question}</h3>
              <span className="faq-icon">
                {activeIndex === index ? 
                  <i className="fas fa-minus"></i> : 
                  <i className="fas fa-plus"></i>
                }
              </span>
            </div>
            <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ; 