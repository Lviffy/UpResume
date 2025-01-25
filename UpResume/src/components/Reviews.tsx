import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Briefcase, Layout, Target, CheckCircle } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Alicia Keys",
    position: "Marketing Director",
    company: "Nairobi",
    image: "/testimonials/alicia.jpg",
    text: "I actually wanted to learn more than what was taught. I wanted to at least understand some of the basics. Then I bought UI / UX design course & completed the whole course."
  },
  {
    id: 2,
    name: "Andrew Clerk",
    position: "Marketing Director",
    company: "Inspire",
    image: "/testimonials/andrew.jpg",
    text: "I actually wanted to learn more than what was taught. I wanted to at least understand some of the basics. Then I bought UI / UX design course & completed the whole course."
  },
  {
    id: 3,
    name: "Alan Becker",
    position: "Marketing Director",
    company: "Recharge",
    image: "/testimonials/alan.jpg",
    text: "I actually wanted to learn more than what was taught. I wanted to at least understand some of the basics. Then I bought UI / UX design course & completed the whole course."
  },
  {
    id: 4,
    name: "Luna Mars",
    position: "Marketing Director",
    company: "Napoli",
    image: "/testimonials/luna.jpg",
    text: "I actually wanted to learn more than what was taught. I wanted to at least understand some of the basics. Then I bought UI / UX design course & completed the whole course."
  },
  {
    id: 5,
    name: "Mark Rober",
    position: "Marketing Director",
    company: "Colorado",
    image: "/testimonials/mark.jpg",
    text: "I actually wanted to learn more than what was taught. I wanted to at least understand some of the basics. Then I bought UI / UX design course & completed the whole course."
  },
  {
    id: 6,
    name: "Sarah Chen",
    position: "Marketing Director",
    company: "Inspire",
    image: "/testimonials/sarah.jpg",
    text: "I actually wanted to learn more than what was taught. I wanted to at least understand some of the basics. Then I bought UI / UX design course & completed the whole course."
  },
  {
    id: 7,
    name: "David Kim",
    position: "Marketing Director",
    company: "TechFlow",
    image: "/testimonials/david.jpg",
    text: "The AI-powered resume builder transformed my job search. The customization options and ATS optimization features are incredible. Highly recommended!"
  },
  {
    id: 8,
    name: "Emma Thompson",
    position: "Marketing Director",
    company: "Innovate",
    image: "/testimonials/emma.jpg",
    text: "Using this platform made resume creation effortless. The AI suggestions were spot-on and helped me highlight my achievements effectively."
  },
  {
    id: 9,
    name: "Michael Chang",
    position: "Marketing Director",
    company: "Nexus",
    image: "/testimonials/michael.jpg",
    text: "The platform's ability to tailor resumes for specific job postings is remarkable. I've seen a significant increase in interview callbacks."
  },
  {
    id: 10,
    name: "Sophie Laurent",
    position: "Marketing Director",
    company: "Vertex",
    image: "/testimonials/sophie.jpg",
    text: "As someone who struggled with resume writing, this tool has been a game-changer. The AI suggestions are practical and industry-specific."
  }
];

// Duplicate testimonials for continuous scroll
const firstRowTestimonials = [...testimonials.slice(0, 5), ...testimonials.slice(0, 5)];
const secondRowTestimonials = [...testimonials.slice(5), ...testimonials.slice(5)];

const Reviews = () => {
  return (
    <div className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-3">
            <span className="relative">
              <span className="absolute inset-0 bg-[linear-gradient(to_left,#4d4d4d,#848484_20%,#ffffff_50%,#848484_80%,#4d4d4d_100%)] bg-clip-text text-transparent blur-[2px] brightness-150"></span>
              <span className="relative bg-[linear-gradient(to_left,#6b6b6b,#848484_20%,#ffffff_50%,#848484_80%,#6b6b6b_100%)] bg-clip-text text-transparent animate-shine-fast">
                Hear from our Satisfied Customers
              </span>
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            See what our customers are saying about their experience with our AI-powered resume builder.
          </p>
        </motion.div>

        {/* First row - scrolling left */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent z-10" />
          <div className="flex animate-scroll-left">
            <div className="flex gap-6 min-w-full">
              {firstRowTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="w-[400px] flex-shrink-0 bg-[#151524]/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:bg-[#1A1A2E]/40 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-purple-500/20 border border-purple-500/30">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/48';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-sm text-gray-400">{testimonial.position}</p>
                      <p className="text-sm text-purple-400">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-300">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second row - scrolling right */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent z-10" />
          <div className="flex animate-scroll-right">
            <div className="flex gap-6 min-w-full">
              {secondRowTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="w-[400px] flex-shrink-0 bg-[#151524]/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:bg-[#1A1A2E]/40 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-purple-500/20 border border-purple-500/30">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/48';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-sm text-gray-400">{testimonial.position}</p>
                      <p className="text-sm text-purple-400">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-300">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
