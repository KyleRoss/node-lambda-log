import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { OutboundLink } from 'gatsby-plugin-google-gtag';
import Url from 'url-parse';
import clsx from 'clsx';


const CustomLink = ({ children, href, target, className, plain, ...props }) => {
  className = clsx(className, { plain });
  const isExternal = /^http(s?):\/\//i.test(href);

  if(isExternal) {
    const rel = ['noreferrer'];
    if(!target) target = '_blank';
    if(target === '_blank') rel.push('noopener');

    return (
      <OutboundLink href={href} target={target} rel={rel.join(' ')} className={className} {...props}>{children}</OutboundLink>
    );
  }

  const url = new Url(href);
  url.set('host', '');
  url.set('protocol', '');

  if(url.pathname.length > 1 && !url.pathname.match(/\/$/)) {
    url.set('pathname', `${url.pathname}/`);
    href = url.href.replace(/^\/{3}/, '/');
  }

  return (
    <Link to={href} className={className} {...props}>{children}</Link>
  );
};

CustomLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  target: PropTypes.string,
  plain: PropTypes.bool,
  className: PropTypes.string
};

CustomLink.defaultProps = {
  plain: false
};

export default CustomLink;
