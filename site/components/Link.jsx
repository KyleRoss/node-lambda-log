/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import clsx from 'clsx';


const Link = React.forwardRef(({ children, href, target, isExternal, prefetch, plain, className, ...props }, ref) => {
  let isAnchor = false;
  if(isExternal === null && typeof href === 'string') {
    isExternal = /^http(s?):\/\//i.test(href);
    isAnchor = /^#/.test(href);
  }

  if(typeof href === 'object') isExternal = false;
  if(isExternal && !target) target = '_blank';

  // Handle smooth scroll to page anchors
  function anchorSmoothScroll(event) {
    if(event) event.preventDefault();

    const el = document.getElementById(href.replace(/#/, ''));
    if(el) {
      el.scrollIntoView({
        behavior: 'smooth'
      });

      window.location.hash = href;
    }
  }

  className = clsx(className, plain ? 'plain' : null);

  const Anchor = (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={isExternal ? 'noreferrer noopener' : undefined}
      className={className}
      onClick={isAnchor ? anchorSmoothScroll : undefined}
      {...props}
    >
      {children}
    </a>
  );

  if(isExternal || isAnchor) {
    return Anchor;
  }

  return (
    <NextLink passHref prefetch={prefetch === false ? false : undefined} href={href}>
      { Anchor }
    </NextLink>
  );
});

Link.displayName = 'Link';

Link.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  target: PropTypes.string,
  isExternal: PropTypes.bool,
  prefetch: PropTypes.bool,
  plain: PropTypes.bool
};

Link.defaultProps = {
  isExternal: null,
  target: null,
  prefetch: true,
  plain: false
};

export default Link;
