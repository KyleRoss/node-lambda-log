import React from 'react';
import PropTypes from 'prop-types';
import { HiHashtag } from 'react-icons/hi';
import Link from '@components/Link';

const LinkedHeading = ({ as, id, children, ...props }) => {
  const Wrapper = as;
  return (
    <Wrapper id={id} {...props}>
      {children}
      {id && <Link plain href={`#${id}`} className="heading-permalink"><HiHashtag /></Link>}
    </Wrapper>
  );
};

LinkedHeading.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  id: PropTypes.string,
  children: PropTypes.node
};

export default LinkedHeading;
