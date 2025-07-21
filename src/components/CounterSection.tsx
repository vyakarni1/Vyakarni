
import { useEffect, useState } from 'react';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

interface CounterSectionProps {
  content: {
    title: string;
    description: string;
  };
  language: "english" | "hindi";
}

const CounterSection = ({ content, language }: CounterSectionProps) => {
  const [counters, setCounters] = useState({
    users: 0,
    texts: 0,
    corrections: 0,
    saved: 0
  });

  const finalValues = {
    users: 10000,
    texts: 100000,
    corrections: 99,
    saved: 15000
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounters(prev => ({
        users: Math.min(prev.users + Math.ceil(finalValues.users / steps), finalValues.users),
        texts: Math.min(prev.texts + Math.ceil(finalValues.texts / steps), finalValues.texts),
        corrections: Math.min(prev.corrections + Math.ceil(finalValues.corrections / steps), finalValues.corrections),
        saved: Math.min(prev.saved + Math.ceil(finalValues.saved / steps), finalValues.saved)
      }));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = language === "english" ? [
    {
      icon: Users,
      value: counters.users.toLocaleString('en-US'),
      label: 'Satisfied Users',
      suffix: '+'
    },
    {
      icon: FileText,
      value: counters.texts.toLocaleString('en-US'),
      label: 'Texts Checked',
      suffix: '+'
    },
    {
      icon: CheckCircle,
      value: counters.corrections,
      label: 'Accurate Correction',
      suffix: '%'
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Service Available',
      suffix: ''
    }
  ] : [
    {
      icon: Users,
      value: counters.users.toLocaleString('hi-IN'),
      label: 'संतुष्ट प्रयोगकर्ता',
      suffix: '+'
    },
    {
      icon: FileText,
      value: counters.texts.toLocaleString('hi-IN'),
      label: 'पाठ जाँचे गये',
      suffix: '+'
    },
    {
      icon: CheckCircle,
      value: counters.corrections,
      label: 'सटीक सुधार',
      suffix: '%'
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'सेवा उपलब्ध',
      suffix: ''
    }
  ];

  return (
    <section className="bg-gradient-blue-primary py-16 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{content.title}</h2>
          <p className="text-xl opacity-90">{content.description}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                  <stat.icon className="h-8 w-8" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
