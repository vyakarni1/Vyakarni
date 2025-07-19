
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Target, Users, Award, Heart, BookOpen, Zap, Shield, Globe, TrendingUp, Clock, CheckCircle, Star, Mail, User, AlertTriangle, XCircle } from "lucide-react";
import Layout from "@/components/Layout";

const About = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("hindi");

  const hindiContent = {
    heroTitle: "हमारे विषय में",
    heroDescription: "हम आधुनिक AI तकनीक के साथ हिंदी भाषा को डिजिटल युग में आगे बढ़ाने के लिये प्रतिबद्ध हैं। हमारा लक्ष्य प्रत्येक व्यक्ति को शुद्ध और प्रभावशाली हिंदी लिखने में सहायता प्रदान करना है।",
    ourStoryTitle: "हमारी कहानी",
    ourStoryText1: "व्याकरणी की आवश्यकता लम्बे समय से अनुभव की जा रही थी। यूँ तो अनुवाद इत्यादि के तो अनेक प्लेटफॉर्म्स उपलब्ध हैं, किन्तु भाषा-शोधन का कोई समर्पित प्लेटफार्म उपलब्ध नही था। हिंदी भाषा के प्रति हमारा प्रेम हमें निरंतर ऐसे किसी प्लेटफार्म के निर्माण हेतु आंदोलित करता रहता था।",
    ourStoryText2: "आज जब यह प्लेटफार्म साकार हो कर हमारे सम्मुख उपस्थित है तो यह हमें अत्यंत संतोष और गौरव का अनुभव देता है तथा इसे आपके साथ साझा करना हमारे इस अनुभव को बहुगुणित कर रहा है।",
    missionVisionTitle: "हमारा ध्येय और दृष्टिकोण",
    missionVisionDesc: "हिंदी भाषा में लोगों की अभिव्यक्ति की क्षमता में वृद्धि करने वाला एक आधुनिक डिजिटल प्लेटफार्म निर्मित कर उसे लोगों के प्रयोग हेतु एक सशक्त विकल्प के रूप में प्रस्तुत करना।",
    missionTitle: "हमारा ध्येय",
    visionTitle: "हमारा दृष्टिकोण",
    teamTitle: "हमारी टीम",
    teamDesc: "व्याकरणी के पीछे समर्पित और अनुभवी व्यक्तियों की टीम",
    coreValuesTitle: "हमारी मूल्य-प्रणाली",
    coreValuesDesc: "हिंदी भाषा के प्रति हमारी प्रतिबद्धता को व्यक्त करने वाले कुछ कारक",
    achievementsTitle: "हमारी उपलब्धियाँ",
    achievementsDesc: "आँकड़े, जो हमारी उपलब्धियों को दर्शाते हैं",
    technologyTitle: "हमारी तकनीक",
    technologyDesc: "AI और मशीन लर्निंग की शक्ति",
    joinUsTitle: "हमसे जुड़ें",
    joinUsText1: "व्याकरणी हमारे लिये एक अभियान है। एक ऐसा अभियान, जिसके माध्यम से हम लोगों को हिंदी भाषा में दक्ष संवाद करने हेतु प्रोत्साहित करेंगे। 'सर्वजन हिताय' की मूल भावना के साथ प्रारंभ किया गया यह अभियान सर्वजन के सहयोग की अनुपस्थिति में पूर्ण न हो सकेगा।",
    joinUsText2: "व्याकरणी के इस महा-अभियान से किसी भी रूप में जुड़ने के लिये आप हमें हमारे ई-मेल support@vyakarni.com पर संपर्क कर सकते हैं।",
    getStartedButton: "तत्काल आरम्भ करें",
    joinCampaignButton: "व्याकरणी अभियान में जुड़ें",
    team: [
      {
        name: "सत्येन श्रीवास्तव",
        title: "संस्थापक एवं मुख्य कार्यकारी अधिकारी",
        bio: "AI तकनीक, उत्पाद नवाचार एवं हिंदी भाषा के प्रचार-प्रसार में गहरी विशेषज्ञता। हिंदी AI के क्षेत्र में अग्रणी।"
      },
      {
        name: "डा. शुभा जैन",
        title: "तकनीकी निदेशक",
        bio: "सिस्टम डिजाइन में विशेषज्ञता। उत्कृष्टता के साथ प्लेटफॉर्म निर्माण।टीम को भाषाई गुणवत्ता एवं उत्कृष्टता की दिशा में मार्गदर्शन।"
      },
      {
        name: "अमिताभ श्रीवास्तव",
        title: "वरिष्ठ AI डेवलपर",
        bio: "AI अनुसंधान और उन्नत तकनीकी विकास में विशेषज्ञता रखने वाले वरिष्ठ AI डेवलपर। मशीन लर्निंग और क्लाउड आर्किटेक्चर में विशेषज्ञता।"
      }
    ]
  };

  const englishContent = {
    heroTitle: "About Us",
    heroDescription: "We are committed to advancing the Hindi language in the digital age with modern AI technology. Our goal is to help every individual write pure and effective Hindi.",
    ourStoryTitle: "Our Story",
    ourStoryText1: "The need for Vyakarni has been felt for a long time. While there are many platforms available for translation, etc., there was no dedicated platform for language refinement. Our love for the Hindi language continuously motivated us to create such a platform.",
    ourStoryText2: "Today, when this platform has materialized and is present before us, it gives us immense satisfaction and pride, and sharing it with you is multiplying this experience manifold.",
    missionVisionTitle: "Our Mission and Vision",
    missionVisionDesc: "To create a modern digital platform that enhances people's expression capabilities in Hindi and present it as a powerful alternative for people's use.",
    missionTitle: "Our Mission",
    visionTitle: "Our Vision",
    teamTitle: "Our Team",
    teamDesc: "A dedicated and experienced team behind Vyakarni",
    coreValuesTitle: "Our Core Values",
    coreValuesDesc: "Some factors that express our commitment to the Hindi language",
    achievementsTitle: "Our Achievements",
    achievementsDesc: "Statistics that reflect our accomplishments",
    technologyTitle: "Our Technology",
    technologyDesc: "The power of AI and machine learning",
    joinUsTitle: "Join Us",
    joinUsText1: "Vyakarni is a campaign for us. A campaign through which we will encourage people to communicate skillfully in Hindi. This campaign, started with the core spirit of 'for the welfare of all', cannot be completed without the cooperation of everyone.",
    joinUsText2: "To join this great campaign of Vyakarni in any form, you can contact us at our email support@vyakarni.com.",
    getStartedButton: "Get Started Now",
    joinCampaignButton: "Join Vyakarni Campaign",
    team: [
      {
        name: "Satyen Srivastava",
        title: "Founder & Chief Executive Officer",
        bio: "Expertise in AI technology, product innovation, and promotion of the Hindi language. A pioneer in the field of Hindi AI."
      },
      {
        name: "Dr. Shubha Jain",
        title: "Technical Director",
        bio: "Expert in system design. Building platforms with excellence. Guides the team towards linguistic quality and excellence."
      },
      {
        name: "Amitabh Srivastav",
        title: "Senior AI Developer",
        bio: "Senior AI developer with expertise in AI research and advanced technological development. Specialist in machine learning and cloud architecture."
      }
    ]
  };

  const currentContent = language === "english" ? englishContent : hindiContent;

  // Team member images
  const teamImages = [
    "https://github.com/vyakarni1/Vyakarni/blob/main/2.png?raw=true", // First team member
    "https://github.com/vyakarni1/Vyakarni/blob/main/3.png?raw=true", // Second team member  
    "https://github.com/vyakarni1/Vyakarni/blob/main/1.png?raw=true", // Third team member
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Language Toggle */}
        <div className="fixed top-20 right-4 z-40 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
          <ToggleGroup
            type="single"
            value={language}
            onValueChange={(value) => value && setLanguage(value as "english" | "hindi")}
            className="gap-1"
          >
            <ToggleGroupItem
              value="hindi"
              className="text-sm px-3 py-1 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              हिंदी
            </ToggleGroupItem>
            <ToggleGroupItem
              value="english"
              className="text-sm px-3 py-1 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              English
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              {currentContent.heroTitle}
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              {currentContent.heroDescription}
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-800">{currentContent.ourStoryTitle}</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6 text-justify">
                  {currentContent.ourStoryText1}
                </p>
                <p className="text-gray-600 text-lg leading-relaxed text-justify">
                  {currentContent.ourStoryText2}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">
                      {language === "english" ? "Language Love" : "भाषा प्रेम"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {language === "english" ? "Deep love and respect for Hindi language" : "हिंदी भाषा के प्रति गहरा प्रेम और सम्मान"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <Zap className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">
                      {language === "english" ? "AI Enhancement" : "AI की शक्ति से भाषा का संवर्धन"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {language === "english" ? "Expression enhancement through AI usage" : "AI के प्रयोग से अभिव्यक्ति का संवर्धन"}  
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">{currentContent.missionVisionTitle}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{currentContent.missionVisionDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <Target className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-2xl text-blue-800">{currentContent.missionTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      {language === "english" 
                        ? "Refining and enhancing language according to the needs of the digital age."
                        : "डिजिटल युग की आवश्यकताओं के अनुरूप भाषा का शोधन एवं संवर्धन करना।"
                      }
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      {language === "english"
                        ? "Making people understand that they can express themselves easily and simply in Hindi through Vyakarni."
                        : "लोगों को यह समझाना कि वे व्याकरणी के माध्यम से स्वयं को सहजता एवं सरलता के साथ हिंदी में अभिव्यक्त कर सकते हैं।"
                      }
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      {language === "english"
                        ? "Encouraging the use of quality Hindi for various traditional components like story writing, novel writing, etc., and modern components like blog writing and audio story writing."
                        : "हिंदी लेखन के विभिन्न पारंपरिक घटकों जैसे कि कथा-लेखन, उपन्यास लेखन इत्यादि तथा आधुनिक घटकों जैसे कि ब्लॉग-लेखन, तथा ऑडियो स्टोरी लेखन हेतु स्तरीय हिंदी के प्रयोग को प्रोत्साहित करना।"
                      }
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <Globe className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle className="text-2xl text-purple-800">{currentContent.visionTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      {language === "english"
                        ? "Providing support to the increasing use of Hindi in the business sector and promoting its usage."
                        : "व्यवसायिक क्षेत्र में हिंदी के बढ़ते उपयोग को संबल प्रदान कर इसके प्रयोग को बढ़ाना।"  
                      }
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      {language === "english"
                        ? "Continuously improving the results obtained through the power of AI by removing errors in Hindi usage."
                        : "AI की शक्ति द्वारा हिंदी प्रयोग की त्रुटियों को दूर करते हुये इसके द्वारा प्राप्त परिणामों में उत्तरोत्तर सुधार करना।"
                      }
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      {language === "english"
                        ? "Creating a medium for communication and expression in Hindi for those we call Gen-Z and Gen-Alpha."
                        : "जिन्हें हम जेन-जी और जेन-अल्फा कहते हैं, उनके लिये हिंदी भाषा में संवाद एवं अभिव्यक्ति का एक माध्यम निर्मित करना।"
                      }
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* What We Do */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-4 text-gray-800">
        {language === "english" ? "What We Do" : "हम क्या करते हैं?"}
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        {language === "english"
          ? "Vyakarni is an advanced AI-powered Hindi writing assistant. We help individuals, students, professionals, writers, educators, and organisations write grammatically correct, elegant, and impactful Hindi. Our tool automatically corrects grammar, spelling, punctuation, sentence structure, and enhances language style, making every Hindi sentence precise, natural, and refined."
          : "व्याकरणी एक उन्नत AI-सक्षम हिंदी लेखन सहायक है। हम व्यक्तियों, छात्रों, पेशेवरों, लेखकों, शिक्षकों और संगठनों को व्याकरण की दृष्टि से शुद्ध, सुरुचिपूर्ण एवं प्रभावशाली हिंदी लिखने में सहायता प्रदान करते हैं। हमारा उपकरण स्वतः ही व्याकरण, वर्तनी, विराम चिह्न, वाक्य संरचना की त्रुटियाँ सुधारता है और भाषा की शैली को परिष्कृत करता है, जिससे प्रत्येक हिंदी वाक्य शुद्ध, स्वाभाविक एवं परिमार्जित बनता है।"}
      </p>
    </div>

    <div className="grid md:grid-cols-1 gap-8">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
          <CardTitle className="text-2xl text-green-800">
            {language === "english" ? "Key Capabilities" : "मुख्य क्षमताएँ"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Automatic correction of grammar, spelling, punctuation, and sentence structure."
                : "व्याकरण, वर्तनी, विराम चिह्न, और वाक्य संरचना की स्वतः सुधार सुविधा।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Language style enhancement for refined and elegant expression."
                : "शब्द चयन और शैली को परिष्कृत करने की क्षमता, जिससे अभिव्यक्ति और अधिक सुंदर एवं प्रभावशाली बनती है।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Helps students, professionals, educators, and organisations write better Hindi effortlessly."
                : "छात्रों, पेशेवरों, शिक्षकों और संगठनों को बिना प्रयास के बेहतर हिंदी लिखने में सहायता करता है।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Makes Hindi writing impactful, natural, and grammatically accurate."
                : "हिंदी लेखन को प्रभावशाली, स्वाभाविक और व्याकरण की दृष्टि से सटीक बनाता है।"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

        {/* Team Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">{currentContent.teamTitle}</h2>
              <p className="text-xl text-gray-600">{currentContent.teamDesc}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {currentContent.team.map((member, idx) => (
                <Card
                  key={member.name}
                  className="text-center hover:shadow-2xl transition-all duration-300 border-blue-100 group bg-white/70"
                >
                  <CardHeader className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 group-hover:scale-105 transition-transform">
                      <img 
                        src={teamImages[idx]} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-blue-700 mb-1">{member.name}</CardTitle>
                    <div className="text-md text-purple-700 mb-2 font-medium">{member.title}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Problems We Solve */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-4 text-gray-800">
        {language === "english" ? "Problems We Solve" : "हम जिन समस्याओं का समाधान करते हैं"}
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        {language === "english"
          ? "Vyakarni solves key challenges faced by Hindi users across educational, professional, and creative domains by offering real-time, automated corrections and elegant enhancements."
          : "व्याकरणी हिंदी उपयोगकर्ताओं द्वारा शैक्षिक, पेशेवर और रचनात्मक क्षेत्रों में झेली जा रही प्रमुख चुनौतियों का समाधान करता है, वह भी त्वरित, स्वचालित सुधारों और परिष्कृत प्रस्तुति के माध्यम से।"}
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
          <CardTitle className="text-2xl text-red-800">
            {language === "english" ? "Key Challenges" : "मुख्य चुनौतियाँ"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Grammar & Syntax Errors: Many Hindi writers, even fluent speakers, struggle with correct grammar, verb forms, and sentence construction."
                : "व्याकरण एवं वाक्य संरचना की त्रुटियाँ: अनेक हिंदी लेखक, चाहे वे धाराप्रवाह ही क्यों न हों, व्याकरण, क्रिया रूपों और वाक्य निर्माण में त्रुटियाँ करते हैं।"}
            </li>
            <li className="flex items-start">
              <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Spelling Mistakes: Frequent spelling errors reduce the clarity and professionalism of Hindi communication."
                : "वर्तनी की गलतियाँ: बार-बार होने वाली वर्तनी की त्रुटियाँ हिंदी संप्रेषण की स्पष्टता एवं व्यावसायिकता को प्रभावित करती हैं।"}
            </li>
            <li className="flex items-start">
              <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Inconsistent Word Usage: Users often mix colloquial and formal Hindi, or use words incorrectly due to regional influences."
                : "शब्द प्रयोग में असंगति: उपयोगकर्ता प्रायः बोलचाल की और औपचारिक हिंदी को मिलाकर प्रयोग करते हैं, या क्षेत्रीय प्रभावों के कारण शब्दों का प्रयोग गलत करते हैं।"}
            </li>
            <li className="flex items-start">
              <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Inelegant Expression: It is difficult for most people to write polished, high-quality Hindi suited for academic, business, or creative use."
                : "असौंदर्यपूर्ण अभिव्यक्ति: अधिकांश लोगों के लिए उच्च गुणवत्ता वाली, परिष्कृत हिंदी लिखना कठिन होता है, जो शैक्षणिक, व्यावसायिक या रचनात्मक उपयोग के योग्य हो।"}
            </li>
            <li className="flex items-start">
              <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Low Confidence: Learners and professionals feel unsure about the correctness of their Hindi, especially in important documents or public communication."
                : "आत्मविश्वास की कमी: विद्यार्थी और पेशेवर अपने हिंदी लेखन की शुद्धता को लेकर अनिश्चित रहते हैं, विशेषकर महत्वपूर्ण दस्तावेज़ों या सार्वजनिक संवाद में।"}
            </li>
            <li className="flex items-start">
              <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Digital Limitation: Lack of reliable, automated tools for Hindi correction restricts digital communication and content creation."
                : "डिजिटल सीमा: हिंदी सुधार हेतु विश्वसनीय, स्वचालित उपकरणों की कमी डिजिटल संचार और कंटेंट निर्माण को सीमित करती है।"}
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
          <CardTitle className="text-2xl text-green-800">
            {language === "english" ? "How Vyakarni Helps" : "व्याकरणी कैसे मदद करता है"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Instant grammar and spelling correction using advanced AI."
                : "उन्नत AI के माध्यम से त्वरित व्याकरण एवं वर्तनी सुधार।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Improves sentence structure and language elegance automatically."
                : "स्वतः वाक्य संरचना एवं भाषा की अभिव्यक्ति को परिष्कृत करता है।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Bridges the gap between casual and formal Hindi writing."
                : "अनौपचारिक और औपचारिक हिंदी लेखन के बीच की खाई को पाटता है।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Enhances user confidence in Hindi writing for any context."
                : "किसी भी संदर्भ में हिंदी लेखन हेतु उपयोगकर्ता के आत्मविश्वास को बढ़ाता है।"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</section>
{/* Target Audience */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-4 text-gray-800">
        {language === "english" ? "Target Audience" : "हमारा लक्षित उपयोगकर्ता समूह"}
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        {language === "english"
          ? "Vyakarni is designed for everyone who cares about writing grammatically correct, polished, and expressive Hindi – whether in academics, work, content creation, or personal communication."
          : "व्याकरणी उन सभी के लिए बनाया गया है जो शुद्ध, परिष्कृत और भावपूर्ण हिंदी लेखन में रुचि रखते हैं – चाहे वह शैक्षिक हो, कार्य से संबंधित हो, रचनात्मक हो या व्यक्तिगत संवाद।"}
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <Users className="h-8 w-8 text-yellow-600 mb-2" />
          <CardTitle className="text-2xl text-yellow-800">
            {language === "english" ? "Who Can Use Vyakarni?" : "कौन उपयोग कर सकता है व्याकरणी?"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Students & Educators: Those learning Hindi or teaching it, who wish to write and submit error-free work."
                : "छात्र एवं शिक्षक: जो हिंदी सीख रहे हैं या पढ़ा रहे हैं, और त्रुटिरहित लेखन करना चाहते हैं।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Professionals & Businesses: Anyone creating official documents, presentations, emails, or reports in Hindi."
                : "पेशेवर एवं व्यवसाय: जो हिंदी में दस्तावेज़, प्रस्तुतियाँ, ईमेल या रिपोर्ट तैयार करते हैं।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Content Creators & Writers: Authors, poets, journalists, bloggers, and media professionals publishing in Hindi."
                : "सामग्री निर्माता एवं लेखक: लेखक, कवि, पत्रकार, ब्लॉगर एवं हिंदी में प्रकाशित करने वाले मीडिया पेशेवर।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Institutions & Organisations: Government offices, NGOs, educational institutions, and enterprises with a need for high-quality Hindi communication."
                : "संस्थान एवं संगठन: सरकारी कार्यालय, एनजीओ, शैक्षिक संस्थान एवं व्यवसायिक संगठन जिनमें स्तरीय हिंदी संप्रेषण की आवश्यकता है।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Diaspora & Global Hindi Speakers: Hindi speakers worldwide who wish to maintain and enhance their written Hindi for personal or professional purposes."
                : "प्रवासी एवं वैश्विक हिंदी भाषी: जो विश्वभर में हिंदी बोलते हैं और अपनी लिखित हिंदी को व्यक्तिगत या पेशेवर कारणों से सुधारना चाहते हैं।"}
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              {language === "english"
                ? "Anyone wishing to improve Hindi writing skills: From school children to senior citizens, Vyakarni is accessible to all who value correct and expressive Hindi."
                : "जो भी हिंदी लेखन कौशल सुधारना चाहता है: स्कूल के बच्चों से लेकर वरिष्ठ नागरिकों तक, व्याकरणी हर उस व्यक्ति के लिए सुलभ है जो शुद्ध और भावपूर्ण हिंदी को महत्व देता है।"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</section>


        {/* Core Values */}
        <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">{currentContent.coreValuesTitle}</h2>
              <p className="text-xl text-gray-600">{currentContent.coreValuesDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">{language === "english" ? "Accuracy" : "सटीकता"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{language === "english" ? "99% accurate grammar correction and reliable results" : "99% सटीक व्याकरण सुधार और विश्वसनीय परिणाम"}</p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">{language === "english" ? "Community" : "समुदाय"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{language === "english" ? "Encouraging the use of language in collaboration with the Hindi language loving community" : "हिंदी भाषा प्रेमी समुदाय के साथ मिलकर भाषा के प्रयोग को प्रोत्साहित करना"}</p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Shield className="h-12 w-12 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">{language === "english" ? "Security" : "सुरक्षा"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{language === "english" ? "Complete security of your data and respect for your privacy" : "आपके डेटा की पूर्ण सुरक्षा और आपकी गोपनीयता का सम्मान"}</p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Heart className="h-12 w-12 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">{language === "english" ? "Service Spirit" : "सेवा भावना"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{language === "english" ? "Full commitment to our customers and 24/7 support" : "अपने ग्राहकों के प्रति पूर्ण प्रतिबद्धता और 24/7 सहायता"}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">{currentContent.achievementsTitle}</h2>
              <p className="text-xl text-gray-600">{currentContent.achievementsDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">{language === "english" ? "Satisfied Users" : "संतुष्ट प्रयोगकर्ता"}</div>
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mt-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">1,00,000</div>
                <div className="text-gray-600">{language === "english" ? "Texts Checked" : "पाठ जाँचे गये"}</div>
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mt-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">99%</div>
                <div className="text-gray-600">{language === "english" ? "Accurate Corrections" : "सटीक सुधार"}</div>
                <Award className="h-8 w-8 text-purple-600 mx-auto mt-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
                <div className="text-gray-600">{language === "english" ? "Service Available" : "सेवा उपलब्ध"}</div>
                <Clock className="h-8 w-8 text-red-600 mx-auto mt-2" />
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">{currentContent.technologyTitle}</h2>
              <p className="text-xl text-gray-600">{currentContent.technologyDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Zap className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl">{language === "english" ? "Advanced AI Model" : "उन्नत AI मॉडल"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{language === "english" ? "AI models specially trained for the Hindi language that suggest improvements by understanding the context." : "हिंदी भाषा के लिये विशेष रूप से प्रशिक्षित AI मॉडल जो संदर्भ को समझकर सुधार सुझाते हैं।"}</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Globe className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle className="text-xl">{language === "english" ? "Real Time Processing" : "वास्तविक समय प्रसंस्करण"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{language === "english" ? "Exemplary suggestions for quick grammar checking and correction." : "त्वरित व्याकरण परीक्षण एवं सुधार के अनुकरणीय सुझाव।"}</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Shield className="h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle className="text-xl">{language === "english" ? "Data Security" : "डेटा सुरक्षा"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{language === "english" ? "End-to-end encryption with complete security of your data." : "आपके डेटा की संपूर्ण सुरक्षा के साथ एंड-टू-एंड एन्क्रिप्शन।"}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">{currentContent.joinUsTitle}</h2>
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-xl mb-6 opacity-90 leading-relaxed">
                {currentContent.joinUsText1}
              </p>
              <p className="text-lg opacity-90">
                {currentContent.joinUsText2}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  {currentContent.getStartedButton}
                </Button>
              </Link>
              <a href="mailto:support@vyakarni.com">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold bg-transparent">
                  {currentContent.joinCampaignButton}
                  <Mail className="h-5 w-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
