import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { OutboundLink } from 'gatsby-plugin-google-gtag';


const CustomLink = ({ children, href, target, ...props }) => {
  const isExternal = /^http(s?):\/\//i.test(href);

  if(isExternal) {
    const rel = ['noreferrer'];
    if(!target) target = '_blank';
    if(target === '_blank') rel.push('noopener');

    return (
      <OutboundLink href={href} target={target} rel={rel.join(' ')} {...props}>{children}</OutboundLink>
    );
  }

  return (
    <Link to={href} {...props}>{children}</Link>
  );
};

CustomLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  target: PropTypes.string
};

export default CustomLink;
