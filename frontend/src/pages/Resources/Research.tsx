import React, { useState } from 'react';

interface ResearchPaper {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract: string;
  link: string;
  category: string;
}

const Research: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const researchPapers: ResearchPaper[] = [
    {
      id: 1,
      title: "Advances in Blood Storage and Preservation Techniques",
      authors: "Johnson, M., Smith, A., Williams, R.",
      journal: "Journal of Transfusion Medicine",
      year: 2023,
      abstract: "This study explores novel methods for extending the shelf life of stored blood products while maintaining their efficacy. The research demonstrates that a combination of optimized storage solutions and temperature control can extend red blood cell viability by up to 20% compared to current standards.",
      link: "https://example.com/blood-storage-research",
      category: "storage"
    },
    {
      id: 2,
      title: "Impact of Regular Blood Donation on Donor Health Outcomes",
      authors: "Chen, L., Garcia, J., Patel, S.",
      journal: "International Journal of Hematology",
      year: 2022,
      abstract: "A longitudinal study of 5,000 regular blood donors over 10 years reveals significant health benefits, including reduced risk of cardiovascular disease and improved iron metabolism. The study controls for lifestyle factors and suggests physiological benefits from regular donation.",
      link: "https://example.com/donor-health-outcomes",
      category: "donor"
    },
    {
      id: 3,
      title: "Artificial Blood Substitutes: Current Progress and Clinical Applications",
      authors: "Nguyen, T., Anderson, K., Lee, H.",
      journal: "Advances in Biomedical Engineering",
      year: 2023,
      abstract: "This review examines the latest developments in artificial blood substitutes, focusing on hemoglobin-based oxygen carriers and perfluorocarbon emulsions. The paper discusses recent clinical trials, regulatory challenges, and potential applications in emergency medicine and military settings.",
      link: "https://example.com/artificial-blood-research",
      category: "innovation"
    },
    {
      id: 4,
      title: "Genetic Factors Influencing Blood Type Distribution Across Populations",
      authors: "Sharma, P., Okonkwo, E., Müller, H.",
      journal: "Human Genetics Review",
      year: 2022,
      abstract: "This comprehensive analysis of genetic data from 50 distinct populations identifies key evolutionary pressures that have shaped blood type distribution worldwide. The research provides insights into historical migration patterns and disease resistance factors related to ABO and Rh blood groups.",
      link: "https://example.com/blood-type-genetics",
      category: "genetics"
    },
    {
      id: 5,
      title: "Improving Blood Donation Rates Through Behavioral Economics Interventions",
      authors: "Wilson, J., Brown, T., Martinez, C.",
      journal: "Public Health Policy Journal",
      year: 2023,
      abstract: "This randomized controlled trial tested various incentive structures and messaging strategies to increase blood donation rates. Results indicate that social recognition combined with flexible scheduling significantly increased donation frequency among both new and returning donors.",
      link: "https://example.com/donation-behavioral-economics",
      category: "donor"
    },
    {
      id: 6,
      title: "Machine Learning Algorithms for Predicting Blood Supply Needs in Crisis Situations",
      authors: "Kim, S., Patel, R., Johansson, L.",
      journal: "Journal of Healthcare Informatics",
      year: 2022,
      abstract: "This paper presents a novel machine learning approach that predicts regional blood supply needs during natural disasters and public health emergencies. The model, trained on historical data from 200 crisis events, demonstrates 87% accuracy in forecasting specific blood type requirements.",
      link: "https://example.com/ml-blood-supply-prediction",
      category: "innovation"
    },
    {
      id: 7,
      title: "Immunological Effects of COVID-19 on Blood Donation and Transfusion",
      authors: "Rodriguez, A., Thompson, S., Al-Farsi, Y.",
      journal: "Transfusion Medicine Reviews",
      year: 2022,
      abstract: "This study examines the impact of COVID-19 infection and vaccination on blood components and transfusion outcomes. The research provides evidence-based guidelines for donation eligibility post-infection and post-vaccination, with implications for blood bank protocols worldwide.",
      link: "https://example.com/covid-blood-donation-effects",
      category: "clinical"
    },
    {
      id: 8,
      title: "Advancements in Pathogen Reduction Technologies for Blood Products",
      authors: "Yamamoto, K., Fischer, M., Osei-Hwedieh, D.",
      journal: "Blood Safety and Quality Journal",
      year: 2023,
      abstract: "This paper reviews emerging technologies for reducing pathogens in blood products, including UV light-based systems, solvent-detergent treatments, and riboflavin-based approaches. The research compares efficacy against various pathogens while assessing impacts on blood component functionality.",
      link: "https://example.com/pathogen-reduction-technologies",
      category: "safety"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Research' },
    { id: 'clinical', name: 'Clinical Studies' },
    { id: 'donor', name: 'Donor Research' },
    { id: 'genetics', name: 'Genetics & Blood Types' },
    { id: 'innovation', name: 'Innovation & Technology' },
    { id: 'safety', name: 'Safety & Quality' },
    { id: 'storage', name: 'Storage & Preservation' }
  ];

  // Filter papers based on category and search term
  const filteredPapers = researchPapers.filter(paper => {
    const matchesCategory = activeCategory === 'all' || paper.category === activeCategory;
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container page-content">
      <div className="page-header">
        <h1>Research & Studies</h1>
        <p>Explore the latest research and scientific studies in blood donation and transfusion medicine.</p>
      </div>

      <div className="research-container">
        <div className="research-filters">
          <div className="category-filter">
            <h3>Categories</h3>
            <ul className="category-list">
              {categories.map(category => (
                <li key={category.id}>
                  <button 
                    className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="search-filter">
            <h3>Search</h3>
            <div className="search-input">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search by title, author, or keywords..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="research-content">
          <h2>{categories.find(c => c.id === activeCategory)?.name || 'All Research'}</h2>
          
          {filteredPapers.length > 0 ? (
            <div className="research-papers">
              {filteredPapers.map(paper => (
                <div key={paper.id} className="research-paper">
                  <h3 className="paper-title">{paper.title}</h3>
                  <div className="paper-meta">
                    <p className="paper-authors">{paper.authors}</p>
                    <p className="paper-journal">
                      <em>{paper.journal}</em>, {paper.year}
                    </p>
                  </div>
                  <p className="paper-abstract">{paper.abstract}</p>
                  <a href={paper.link} target="_blank" rel="noopener noreferrer" className="paper-link">
                    <i className="fas fa-external-link-alt"></i> Read Full Paper
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <i className="fas fa-file-alt"></i>
              <h3>No research papers found</h3>
              <p>Try adjusting your search criteria or selecting a different category.</p>
            </div>
          )}
        </div>
      </div>

      <div className="research-disclaimer">
        <p>
          <i className="fas fa-info-circle"></i> The research papers presented here are for educational purposes. 
          For the most current and comprehensive research in blood donation and transfusion medicine, 
          please refer to peer-reviewed journals and official medical publications.
        </p>
      </div>
    </div>
  );
};

export default Research; 