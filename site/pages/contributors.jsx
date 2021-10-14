import React, { useState, useEffect } from 'react';
import PageLayout from '@/layouts/Page';
import Link from '@components/Link';
import styles from './Contributors.module.css';

const emojiMap = {
  audio: {
    title: 'Audio',
    emoji: '🔊'
  },
  a11y: {
    title: 'Accessibility',
    emoji: '♿️'
  },
  bug: {
    title: 'Bug Reports',
    emoji: '🐛',
    link: 'https://github.com/KyleRoss/node-lambda-log/issues?q=author%3A<<user>>+sort%3Aupdated-desc'
  },
  blog: {
    title: 'Blog Posts',
    emoji: '📝'
  },
  business: {
    title: 'Business Development',
    emoji: '💼'
  },
  code: {
    title: 'Code',
    emoji: '💻',
    link: 'https://github.com/KyleRoss/node-lambda-log/commits?author=<<user>>'
  },
  content: {
    title: 'Content',
    emoji: '🖋'
  },
  data: {
    title: 'Data',
    emoji: '🔣'
  },
  doc: {
    title: 'Documentation',
    emoji: '📖',
    link: 'https://github.com/KyleRoss/node-lambda-log/commits?author=<<user>>'
  },
  design: {
    title: 'Design',
    emoji: '🎨'
  },
  example: {
    title: 'Examples',
    emoji: '💡'
  },
  eventOrganizing: {
    title: '📋',
    emoji: 'Event Organizers'
  },
  financial: {
    title: 'Financial Support',
    emoji: '💵'
  },
  fundingFinding: {
    title: 'Funding/Grant Finders',
    emoji: '🔍'
  },
  ideas: {
    title: 'Ideas/Planning',
    emoji: '🤔'
  },
  infra: {
    title: 'Infrastructure',
    emoji: '🚇'
  },
  maintenance: {
    title: 'Maintenance',
    emoji: '🚧'
  },
  mentoring: {
    title: 'Mentoring',
    emoji: '🧑‍🏫'
  },
  platform: {
    title: 'Packaging',
    emoji: '📦'
  },
  plugin: {
    title: 'Plugin/Utilities',
    emoji: '🔌'
  },
  projectManagement: {
    title: 'Project Management',
    emoji: '📆'
  },
  question: {
    title: 'Question',
    emoji: '💬'
  },
  research: {
    title: 'Research',
    emoji: '🔬'
  },
  review: {
    title: 'PR Reviews',
    emoji: '👀'
  },
  security: {
    title: 'Security',
    emoji: '🛡️'
  },
  tool: {
    title: 'Tools',
    emoji: '🔧'
  },
  translation: {
    title: 'Translation',
    emoji: '🌍',
    link: 'https://github.com/KyleRoss/node-lambda-log/commits?author=<<user>>'
  },
  test: {
    title: 'Tests',
    emoji: '⚠️',
    link: 'https://github.com/KyleRoss/node-lambda-log/commits?author=<<user>>'
  },
  tutorial: {
    title: 'Tutorials',
    emoji: '✅'
  },
  talk: {
    title: 'Talks',
    emoji: '📢'
  },
  userTesting: {
    title: 'User Testing',
    emoji: '📓'
  },
  video: {
    title: 'Videos',
    emoji: '📹'
  }
};

const Contributors = () => {
  const meta = {
    title: 'Contributors'
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getContributors() {
      const data = await fetch('https://raw.githubusercontent.com/KyleRoss/node-lambda-log/master/.all-contributorsrc').then(resp => resp.json());

      if(data?.contributors) {
        setUsers(data.contributors);
      }
    }

    getContributors();
  }, []);

  return (
    <PageLayout meta={meta}>
      <section className="page-hero">
        <div className="container-wrapper">
          <h1>
            Contributors <small>A special thanks to all of the contributors!</small>
          </h1>
        </div>
      </section>

      <section className="container-wrapper mt-12">
        <p className="mb-8">
          Thank you to all of the awesome people who have contributed to LambdaLog, this project wouldn't be what it is without you!
        </p>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-6">
          {users.map(user => (
            <div key={user.login} className={styles.contributor}>
              <Link plain href={`https://github.com/${user.login}`}>
                <div className="avatar" style={{ backgroundImage: `url(${user.avatar_url})` }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="m268 112 144 144-144 144m124-144H100" />
                  </svg>
                </div>
              </Link>
              <div className="content">
                <Link plain href={`https://github.com/${user.login}`}>
                  <strong>{user.name}</strong>
                  <small>{user.login}</small>
                </Link>

                <ul>
                  {user.contributions.map(contrib => {
                    const c = emojiMap[contrib];
                    if(!c) return null;

                    return (
                      <li key={`${user.login}-${contrib}`} title={c.title}>
                        {c.link ? (
                          <Link plain href={c.link.replace(/<<user>>/g, user.login)} title={c.title}>
                            {c.emoji}
                          </Link>
                        ) : c.emoji}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 well well-info">
          <strong className="block">You can contribute too!</strong>
          Help improve this project with just a <Link href="/docs/latest/contributing">few steps</Link>.
        </p>
      </section>

      <section className="container-wrapper mt-12">
        <h2>Sponsors</h2>
        <p className="text-2xl text-warm-400 font-light tracking-tight">
          There is currently no sponsors <span role="img" aria-label="disappointed face">😞</span>
        </p>

        <p className="mt-12 well well-info">
          <strong className="block">Want to help keep this project alive and many others?</strong>
          Your <Link href="/docs/latest/sponsorship">sponsorship</Link> will help keep the lights on.
        </p>
      </section>
    </PageLayout>
  );
};


export default Contributors;
