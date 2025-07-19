import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { language } = useLanguage();

  const englishContent = {
    title: "About Vyakarni",
    description: "Learn more about our mission and team.",
    mission: "Our Mission",
    missionDescription: "To provide the best Hindi grammar checking tool using advanced AI technology.",
    team: "Our Team",
    teamDescription: "A dedicated team of linguists and AI experts.",
    values: "Our Values",
    value1: "Innovation",
    value1Description: "We constantly innovate to improve our services.",
    value2: "Quality",
    value2Description: "We are committed to providing high-quality grammar checking.",
    value3: "Accessibility",
    value3Description: "We strive to make our tool accessible to everyone."
  };

  const hindiContent = {
    title: "व्याकरणी के बारे में",
    description: "हमारे मिशन और टीम के बारे में अधिक जानें।",
    mission: "हमारा मिशन",
    missionDescription: "उन्नत AI तकनीक का उपयोग करके सर्वश्रेष्ठ हिंदी व्याकरण जाँच उपकरण प्रदान करना।",
    team: "हमारी टीम",
    teamDescription: "भाषाविदों और AI विशेषज्ञों की एक समर्पित टीम।",
    values: "हमारे मूल्य",
    value1: "नवीनता",
    value1Description: "हम अपनी सेवाओं को बेहतर बनाने के लिए लगातार नवाचार करते हैं।",
    value2: "गुणवत्ता",
    value2Description: "हम उच्च गुणवत्ता वाली व्याकरण जाँच प्रदान करने के लिए प्रतिबद्ध हैं।",
    value3: "उपलब्धता",
    value3Description: "हम अपने उपकरण को सभी के लिए सुलभ बनाने का प्रयास करते हैं।"
  };

  const currentContent = language === "english" ? englishContent : hindiContent;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {currentContent.title}
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          {currentContent.description}
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {currentContent.mission}
          </h2>
          <p className="text-gray-600">
            {currentContent.missionDescription}
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {currentContent.team}
          </h2>
          <p className="text-gray-600">
            {currentContent.teamDescription}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {currentContent.values}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {currentContent.value1}
              </h3>
              <p className="text-gray-600">
                {currentContent.value1Description}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {currentContent.value2}
              </h3>
              <p className="text-gray-600">
                {currentContent.value2Description}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {currentContent.value3}
              </h3>
              <p className="text-gray-600">
                {currentContent.value3Description}
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
