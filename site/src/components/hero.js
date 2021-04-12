import React, { useEffect } from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import { useCountUp } from 'react-countup';
import { PageContainer, ContentContainer } from '@styles/components';

const StyledHero = styled.section`
  ${PageContainer}
  color: ${props => props.theme.colors.white};
  padding: 4rem 0;
  margin-top: 70px;

  .hero-inner {
    ${ContentContainer}
    text-align: center;
  }

  .tagline {
    font-size: 2rem;
    font-weight: 900;
    color: ${props => props.theme.colors.white};
  }

  .downloads {
    font-size: 1.5rem;
    font-weight: 500;
    color: ${props => lighten(0.4, props.theme.colors.secondary)};
  }
`;


const Hero = () => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: 0,
    separator: ',',
    startOnMount: true
  });

  useEffect(() => {
    fetch('https://api.npmjs.org/downloads/point/2017-01-01:3000-01-01/lambda-log')
      .then(response => response.json())
      .then(data => {
        if(data.downloads) update(data.downloads);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledHero>
      <div className="hero-inner">
        <div className="tagline">The Most Popular Lambda Logger for Node.js</div>
        <div className="downloads">with {countUp} Downloads</div>
      </div>
    </StyledHero>
  );
};

export default Hero;
