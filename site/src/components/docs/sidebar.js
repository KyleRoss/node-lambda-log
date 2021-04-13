import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import { darken } from 'polished';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { IoCloseSharp } from 'react-icons/io5';
import { urlSafeMarkdownHeading } from '@src/utils';


const StyledSidebar = styled.aside`
  position: absolute;
  top: 0;
  width: 230px;
  min-width: 230px;
  height: 100%;
  background-color: rgba(255,255,255, 0.8);
  border-right: 3px solid ${props => darken(-0.65, props.theme.colors.black)};
  padding: 0 0.6rem 0 0;
  margin-right: 1rem;
  overflow: auto;

  a {
    transition: color 0.2s;
    color: ${props => props.theme.colors.dark};

    &.root {
      display: flex;
      align-items: center;

      svg {
        color: ${props => darken(0.1, props.theme.colors.gray)};
      }
    }

    &:hover {
      color: ${props => props.theme.colors.primary};
    }
    
    &.active {
      color: ${props => props.theme.colors.primary};
      font-weight: 700;
      
      svg {
        color: ${props => props.theme.colors.primary};
      }
    }
  }

  ${down('md')} {
    position: fixed;
    transform: translateX(-100vw);
    width: 100%;
    min-width: 100%;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    backdrop-filter: blur(6px);
    z-index: 900;
    padding: 2rem;
    border: 0;
    margin: 0;
    transition: transform 0.3s;
    font-size: 1.3rem;

    &.open {
      transform: translateX(0);
    }
  }

  ul {
    list-style: none;
    margin: 0;

    li {
      a {
        font-weight: 500;
      }

      ul {
        margin-left: 1.5rem;
        margin-bottom: 1rem;

        li {
          a {
            font-weight: 400;
            font-size: 90%;
          }
        }
      }
    }
  }
`;

const StyledMenuBtn = styled.div`
  position: fixed;
  z-index: 950;
  display: none;
  justify-content: center;
  align-items: center;
  bottom: 2rem;
  right: 2rem;
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  cursor: pointer;

  svg {
    width: 2rem;
    height: auto;
    color: ${props => props.theme.colors.white};
  }

  ${down('md')} {
    display: flex;
  }
`;

const DocsSidebar = ({ location }) => {
  const data = useStaticQuery(graphql`
    query GetAllDocPages {
      allMarkdownRemark(sort: { fields: frontmatter___order, order: ASC }) {
        edges {
          node {
            id
            frontmatter {
              title
              slug
            }
            headings(depth: h2) {
              value
            }
          }
        }
      }
    }
  `);

  const pages = data.allMarkdownRemark.edges.map(({ node }) => node);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPage = location.pathname.replace(/\/docs\//i, '');

  return (
    <React.Fragment>
      <StyledSidebar className={sidebarOpen ? 'open' : ''}>
        <ul>
          {pages.map(page => (
            <li key={page.id}>
              <Link to={`/docs/${page.frontmatter.slug}`} className="plain root" activeClassName="active" onClick={() => setSidebarOpen(false)}>
                <MdKeyboardArrowRight />
                {page.frontmatter.title}
              </Link>
              {(Boolean(page.headings.length) && currentPage === page.frontmatter.slug) && (
                <ul className="sub-menu">
                  {page.headings.map(heading => (
                    <li key={`${page.id}-${heading.value}`}>
                      <Link
                        to={`/docs/${page.frontmatter.slug}#${urlSafeMarkdownHeading(heading.value)}`}
                        className="plain"
                        dangerouslySetInnerHTML={{ __html: heading.value }}
                        onClick={() => setSidebarOpen(false)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </StyledSidebar>

      <StyledMenuBtn onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? (
          <IoCloseSharp />
        ) : (
          <RiMenuUnfoldLine />
        )}
      </StyledMenuBtn>
    </React.Fragment>
  );
};

DocsSidebar.propTypes = {
  location: PropTypes.object
};

export default DocsSidebar;
