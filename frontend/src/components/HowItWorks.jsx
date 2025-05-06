import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: '🔍',
      title: 'Search Jobs',
      description: 'Browse through thousands of job listings from top companies'
    },
    {
      icon: '📝',
      title: 'Apply Easily',
      description: 'Submit your application with just a few clicks'
    },
    {
      icon: '💼',
      title: 'Get Hired',
      description: 'Connect with employers and land your dream job'
    }
  ];

  return (
    <section className="how-it-works">
      <div className="how-it-works-container">
        <h2 className="how-it-works-title">
          How It Works
        </h2>
        <div className="how-it-works-steps">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="how-it-works-step"
            >
              <div className="how-it-works-step-icon">{step.icon}</div>
              <h3 className="how-it-works-step-title">
                {step.title}
              </h3>
              <p className="how-it-works-step-description">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;