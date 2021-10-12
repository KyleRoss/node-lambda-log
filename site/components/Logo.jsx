import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Link from '@components/Link';

const Logo = ({ linked, withText, primaryColor, secondaryColor, className, ...props }) => {
  const Svg = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101 74">
      <path className="lambda" fill={primaryColor} d="M67.656 56.734a5.757 5.757 0 01-4.7-2.659 23.632 23.632 0 01-3.307-6.614q-1.33-3.953-3.239-10.977-2.319-8.658-4.261-14.08a28.712 28.712 0 00-5.216-9.2 10.3 10.3 0 00-8.114-3.784h-5.595v7.227h4.023a5.794 5.794 0 014.807 2.9 32.918 32.918 0 013.784 8.284l-15.614 36.13h8.182l10.636-24.614A122.953 122.953 0 0053.1 52.029a26.337 26.337 0 005.216 8.523 10.27 10.27 0 007.773 3.409h5.659v-7.227h-4.092z" />
      <path className="curly" fill={secondaryColor} d="M73.792 73.847q8.863 0 13.023-3.273t4.159-10.909a41.347 41.347 0 00-.682-6.273 41.432 41.432 0 01-.545-5.046q0-1.636 2.625-4.5a73.228 73.228 0 018.011-7.159q-10.637-8.521-10.636-11.931a32.725 32.725 0 01.545-4.568 37.645 37.645 0 00.682-6.409q0-7.635-4.159-10.943T73.792-.471v5.318q6.068 0 8.8 2.045t2.727 7.159a23.629 23.629 0 01-.75 5.727 25.2 25.2 0 00-.545 4.3 11.431 11.431 0 002.045 6.511 26.386 26.386 0 006.136 6.1A25.7 25.7 0 0086 42.654a11.066 11.066 0 00-1.977 6.375 25.124 25.124 0 00.545 4.227 33.469 33.469 0 01.682 6.2q0 5.047-2.693 7.057t-8.761 2.011v5.318zM26.383 68.529q-6.069 0-8.761-2.011t-2.693-7.057a33.384 33.384 0 01.682-6.2 25.231 25.231 0 00.545-4.227 11.074 11.074 0 00-1.977-6.375 25.735 25.735 0 00-6.2-5.966 26.386 26.386 0 006.136-6.1 11.431 11.431 0 002.045-6.511 25.3 25.3 0 00-.545-4.3 23.58 23.58 0 01-.75-5.727q0-5.114 2.727-7.159t8.8-2.045V-.471q-8.864 0-13.023 3.307T9.2 13.779a37.534 37.534 0 00.682 6.409 32.889 32.889 0 01.545 4.568q0 3.41-10.636 11.932A73.46 73.46 0 017.8 43.847q2.624 2.864 2.625 4.5a41.651 41.651 0 01-.545 5.046 41.2 41.2 0 00-.68 6.273q0 7.635 4.159 10.909t13.023 3.273v-5.319z" />
    </svg>
  );

  const LogoText = (
    <div className="logo-text">
      lambda<strong>log</strong>
    </div>
  );

  const WrapperEl = linked ? Link : 'div';
  const wrapperProps = {
    className: clsx('brand', className),
    ...props
  };

  if(linked) {
    wrapperProps.plain = true;
    wrapperProps.href = '/';
  }

  return (
    <WrapperEl {...wrapperProps}>
      {Svg}
      {withText && LogoText}
    </WrapperEl>
  );
};

Logo.propTypes = {
  linked: PropTypes.bool,
  withText: PropTypes.bool,
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string
};

Logo.defaultProps = {
  linked: true,
  primaryColor: '#F97316',
  secondaryColor: '#A8A29E'
};

export default Logo;
