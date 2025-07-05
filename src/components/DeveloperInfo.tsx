import React from 'react';
import { Clock, Code2, GitBranch, GitPullRequest } from 'lucide-react';

interface DeveloperInfoProps {
  isDarkMode?: boolean;
}

const DeveloperInfo: React.FC<DeveloperInfoProps> = ({ isDarkMode = true }) => {
  const languages = [
    { name: 'TypeScript', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg', color: '#007ACC' },
    { name: 'React', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg', color: '#61DAFB' },
    { name: 'Node.js', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg', color: '#339933' },
    { name: 'Python', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg', color: '#3776AB' },
    { name: 'JavaScript', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg', color: '#F7DF1E' },
    { name: 'HTML5', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg', color: '#E34F26' },
    { name: 'CSS3', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg', color: '#1572B6' },
    { name: 'TailwindCSS', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg', color: '#38B2AC' }
  ];

  return (
    <div className={`h-full flex flex-col p-6 rounded-2xl border transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gray-800/50 border-gray-700' 
        : 'bg-white/50 border-slate-200'
    }`}>
      {/* Development Stats */}
      <div className="space-y-8">
        <div>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>Development Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg transition-colors duration-500 ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-slate-100'
            }`}>
              <div className="flex items-center space-x-2">
                <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Development Time
                </span>
              </div>
              <p className={`mt-1 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                2 Months
              </p>
            </div>
            <div className={`p-3 rounded-lg transition-colors duration-500 ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-slate-100'
            }`}>
              <div className="flex items-center space-x-2">
                <GitBranch className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Active Branches
                </span>
              </div>
              <p className={`mt-1 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                4 Branches
              </p>
            </div>
            <div className={`p-3 rounded-lg transition-colors duration-500 ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-slate-100'
            }`}>
              <div className="flex items-center space-x-2">
                <Code2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Lines of Code
                </span>
              </div>
              <p className={`mt-1 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                15K+
              </p>
            </div>
            <div className={`p-3 rounded-lg transition-colors duration-500 ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-slate-100'
            }`}>
              <div className="flex items-center space-x-2">
                <GitPullRequest className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Pull Requests
                </span>
              </div>
              <p className={`mt-1 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                120+
              </p>
            </div>
          </div>
        </div>

        {/* Technologies Used */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>Technologies Used</h3>
          <div className="grid grid-cols-4 gap-3">
            {languages.map((lang) => (
              <div
                key={lang.name}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-500 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-slate-100'
                }`}
              >
                <img
                  src={lang.icon}
                  alt={`${lang.name} icon`}
                  className="w-8 h-8 mb-2 object-contain"
                  style={{ filter: isDarkMode ? 'brightness(0.9)' : 'none' }}
                />
                <span className={`text-xs font-medium text-center transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  {lang.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperInfo; 