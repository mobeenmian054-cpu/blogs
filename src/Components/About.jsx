import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-40">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          About <span className="text-indigo-600">Story Nest</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          We are a community of writers, thinkers, and storytellers.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            Story Nest was founded with a simple mission: to provide a platform where voices can be heard and stories can be shared. Whether you are an industry expert, a passionate hobbyist, or just someone with a unique perspective, Story Nest is your home.
          </p>
          <p>
            Our platform allows you to explore a wide range of topics, from technology and science to arts and culture. We believe in the power of words to inspire, educate, and connect people from all walks of life.
          </p>
          <p>
            Join us on this journey. Read, write, comment, and engage with a community that values quality content and meaningful conversation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;