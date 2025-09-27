import React from "react";
import {
  Users,
  Clock,
  ShieldCheck,
  Leaf,
  Smartphone,
  Quote,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#0F0F23] text-white">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#0F0F23]">
        <div className="max-w-7xl mx-auto">
          {/* Top Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
              About Us
            </h2>
          </div>

          {/* Main Hero Card */}
          <div className="bg-[#28283A] rounded-3xl p-8 sm:p-12 text-center">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-xs">🍽️</span>
              </div>
              <p className="text-gray-400 text-sm font-normal">
                Revolutionizing campus dining since 2023
              </p>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-4">
              No more waiting,
              <br />
              Just Eating.
            </h1>

            {/* Subheading */}
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
              Where technology meets hunger, and students meet convenience
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#0F0F23]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-8">
              Born from the everyday hustle of college life
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                At{" "}
                <span className="font-semibold text-white">Campus Bites</span>,
                we believe food should be quick, convenient, and
                student-friendly.
              </p>
              <p className="text-lg">
                Powered by{" "}
                <span className="font-semibold text-white">
                  SMARTDESH TECHNOLOGIES LLP
                </span>
                , Campus Bites is more than just a food ordering app — it's a
                movement.
              </p>
              <p className="text-lg">
                No more standing in long queues — just smart, seamless food
                ordering.
              </p>
            </div>
          </div>

          {/* Right - Digital India Card */}
          <div className="bg-[#1A1A2E] rounded-3xl p-8 h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <img
                  src="/Food & Beverage.gif"
                  alt="Digital India GIF"
                  className="w-24 h-24 object-contain rounded-lg"
                />
              </div>
              <p className="text-2xl font-semibold text-white mb-2">
                Digital India
              </p>
              <p className="text-sm text-gray-400">
                Empowering technology for a smarter future
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#0F0F23] w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-white font-bold mb-16 text-4xl sm:text-5xl">
            Our mission drives our vision
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoCard
              icon="🎯"
              title="Our Mission"
              desc="To make campus dining faster, healthier, and smarter by bridging the gap between students and canteens with technology."
            />
            <InfoCard
              icon="🚀"
              title="Our Vision"
              desc="To become India's most trusted student-focused food platform, bringing convenience, hygiene, and eco-friendly practices to every campus — all while moving forward under the vision of our Hon'ble Prime Minister Shri Narendra Modi's Digital India initiative, which empowers the nation to embrace technology for a smarter and more connected future."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#0F0F23] w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-white font-bold mb-6 text-4xl sm:text-5xl">
            Built by students, for students with ❤️ in India
          </h2>
          <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
            We designed Campus Bites to solve real problems faced by students.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Smartphone />}
              title="Easy Ordering"
              desc="Browse menus, place orders, and pay securely."
              color="blue"
              index={0}
            />
            <FeatureCard
              icon={<Clock />}
              title="Zero Queues"
              desc="Skip the wait — grab your food instantly when it's ready."
              color="green"
              index={1}
            />
            <FeatureCard
              icon={<ShieldCheck />}
              title="Hygiene First"
              desc="Partner canteens follow strict food safety standards."
              color="purple"
              index={2}
            />
            <FeatureCard
              icon={<Users />}
              title="Student-Centric"
              desc="Built by students, for students."
              color="orange"
              index={3}
            />
            <FeatureCard
              icon={<Leaf />}
              title="Eco-Friendly"
              desc="Encouraging biodegradable packaging & sustainability."
              color="teal"
              index={4}
            />
          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#0F0F23] w-full">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#28283A] rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative w-full max-w-sm mx-auto md:mx-0">
                <img
                  src="/Founder-CB.jpg"
                  alt="Garv Saluja - Founder | Campus Bites"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Text */}
              <div>
                <h2 className="text-white font-bold mb-4 text-3xl">
                  Founder's Note
                </h2>
                <h3 className="text-xl font-semibold text-blue-400 mb-6">
                  Garv Saluja <br /> Founder, Campus Bites
                </h3>
                <p className="text-gray-300 mb-4 text-lg">
                  Campus Bites was born from a simple observation: students
                  spend too much time waiting in queues instead of focusing on
                  what truly matters.
                </p>
                <p className="text-gray-300 text-lg">
                  It's not just a food ordering app — it's a step toward
                  transforming campus life with innovation and convenience.
                </p>
                <blockquote className="mt-8 p-6 bg-[#1A1A2E] border-l-4 border-blue-500 rounded-r-xl italic text-lg">
                  "Entrepreneurship is about solving problems that impact lives
                  — starting with the lives of students around me."
                </blockquote>
                <p className="mt-2 font-semibold text-blue-400">
                  — Garv Saluja
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#0F0F23] w-full">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-[#28283A] rounded-3xl p-12">
            <h2 className="text-white font-extrabold mb-8 text-4xl sm:text-5xl leading-tight">
              Food should fuel your journey, not slow it down ✨
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
              Join thousands of students revolutionizing campus dining
            </p>
            <a href="/">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg text-lg">
                Get Campus Bites
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Components */
function InfoCard({ icon, title, desc, delay = 0 }) {
  return (
    <div className="bg-[#28283A] rounded-2xl p-8">
      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-6 text-2xl">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-300 text-lg">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, index }) {
  const colors = {
    blue: "bg-[#4285F4] text-white",
    green: "bg-[#34A853] text-white",
    purple: "bg-[#8B5CF6] text-white",
    orange: "bg-[#E65100] text-white",
    teal: "bg-[#00BFA5] text-white",
  };

  return (
    <div className="bg-[#28283A] rounded-2xl p-8 text-center">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${colors[color]}`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{desc}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
        {number}
      </div>
      <div className="text-sm sm:text-base text-[#666666] dark:text-[#A0A0A0] font-medium">
        {label}
      </div>
    </div>
  );
}

function TeamMember({ name, role, image, description }) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md text-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-2">
        {name}
      </h3>
      <p className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium mb-3">
        {role}
      </p>
      <p className="text-sm text-[#666666] dark:text-[#A0A0A0]">
        {description}
      </p>
    </div>
  );
}

function ValueCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md text-center">
      <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">{icon}</div>
      <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-3 sm:mb-4">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-[#666666] dark:text-[#A0A0A0]">
        {description}
      </p>
    </div>
  );
}

function TimelineItem({ year, title, description }) {
  return (
    <div className="flex items-start space-x-4 sm:space-x-6">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
          {year}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-[#666666] dark:text-[#A0A0A0]">
          {description}
        </p>
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, content, rating }) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">
            ⭐
          </span>
        ))}
      </div>
      <p className="text-sm sm:text-base text-[#666666] dark:text-[#A0A0A0] mb-4 italic">
        "{content}"
      </p>
      <div>
        <h4 className="font-bold text-black dark:text-white">{name}</h4>
        <p className="text-sm text-blue-600 dark:text-blue-400">{role}</p>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, content, link }) {
  return (
    <a
      href={link}
      className="bg-white dark:bg-[#1E1E1E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition text-center block"
    >
      <div className="text-3xl sm:text-4xl mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-[#666666] dark:text-[#A0A0A0]">
        {content}
      </p>
    </a>
  );
}

function SocialLink({ icon, label, href }) {
  return (
    <a
      href={href}
      className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition text-lg"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
