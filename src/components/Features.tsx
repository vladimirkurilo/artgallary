import React from 'react';
import { motion } from 'motion/react';
import { Box, Layers, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Box size={32} />,
      title: "Виртуальные выставки",
      desc: "Иммерсивные 3D-галереи, созданные для пространственного исследования цифровых шедевров."
    },
    {
      icon: <Layers size={32} />,
      title: "Умные роялти",
      desc: "Автоматизированное распределение при вторичных продажах, встроенное в каждый транзакционный уровень."
    },
    {
      icon: <Zap size={32} />,
      title: "Движок кураторства",
      desc: "Кураторство с помощью ИИ, помогающее тематически организовывать работы и находить новые таланты."
    }
  ];

  return (
    <section className="py-24 px-10 bg-[#0D0D0D] border-y border-border">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className={cn(
              "flex flex-col p-12 border-border",
              i < features.length - 1 ? "md:border-r" : ""
            )}
          >
            <div className="text-accent mb-8">
              {f.icon}
            </div>
            <h3 className="text-3xl font-serif mb-4 leading-tight italic font-bold">{f.title}</h3>
            <p className="text-sm font-light text-[#666] leading-relaxed max-w-xs">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
