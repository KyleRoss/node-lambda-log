import React from 'react';
import PropTypes from 'prop-types';
import reactReplace from 'react-string-replace';
import clsx from 'clsx';
import { slug } from 'github-slugger';
import { IoMdReturnRight } from 'react-icons/io';
import LinkedHeading from '@components/LinkedHeading';
import Link from '@components/Link';


const ApiHeading = ({ as, type, text, returns, link, scope, since, deprecated, sticky }) => {
  function getType(t) {
    if(t.url) {
      return (
        <Link plain href={t.url}>{t.type}</Link>
      );
    }

    return t.type;
  }

  function getReturns() {
    if(!returns) return null;

    const types = returns.split('|').map(type => {
      let url = link && link !== 'null' ? link : null;
      if(!link && /^#/.test(type)) {
        type = type.replace(/^#/, '');
        url = `#${slug(type)}`;
      }

      if(!link && /<#.*>/.test(type)) {
        const regx = /<(#.*)>/;
        url = `#${slug(type.match(regx)[1].replace(/#/, ''))}`;
        type = type.replace(/#/, '');
      }

      return {
        type,
        url
      };
    });

    return (
      <div className="api-returns">
        <IoMdReturnRight />
        {types.map(t => (
          <span key={`${type}-${text}-${t.type}`} className="return-type">
            {getType(t)}
          </span>
        ))}
      </div>
    );
  }

  function getBadges() {
    const badges = [];
    if(deprecated) {
      badges.push((
        <div className="badge deprecated badge-small">
          <span>{deprecated}</span>
        </div>
      ));
    }

    if(since) {
      badges.push((
        <div className="badge since badge-small">
          <span>{since}</span>
        </div>
      ));
    }

    return <span className="api-heading-badges ml-auto">{badges}</span>;
  }

  function formatText(text) {
    let txt = null;
    if(type === 'event') txt = <><span className="prefix">Event:</span> {text}</>;
    if(type === 'function') {
      let [, start, args] = /^(.*)(?=\()(\(.*\))/.exec(text);
      let [, prefix, method] = /^([a-zA-Z0-9]*\.?)(.*)/.exec(start);
      if(!method) {
        method = prefix;
        prefix = '';
      }

      const str = [];

      if(prefix) str.push(<span key={`prefix-${text}-${prefix}-fn`} className="prefix">{prefix}</span>);
      method = reactReplace(method, /(<|>|\|)/g, (match, i) => {
        return <span key={`${text}-${i}-method`} className="punc">{match}</span>;
      });

      str.push(<span key={`method-${text}-${method}-fn`} className="func">{method}</span>);

      args = reactReplace(args, /([a-zA-Z0-9[\]]+)/g, (match, i) => {
        const isOptional = match.match(/^\[.*\]$/);
        return <span key={`${text}-${i}-args`} className={clsx('arg', isOptional ? ' optional' : null)}>{match}</span>;
      });

      str.push(<span key={`args-${text}-${args}-fn`} className="args">{args}</span>);

      txt = str;
    }

    if(type === 'property' || type === 'getter' || type === 'setter') {
      const str = [];
      const parts = text.split('.');

      let prop = parts.pop();
      if(parts.length) str.push(<span key={`parts-${text}-${parts}-${type}`} className="prefix">{parts.join('.')}.</span>);

      if(prop.match(/=/)) {
        prop = reactReplace(prop, /(=.*)/, (match, i) => (
          <span key={`${text}-${i}-prop-equals`} className="equal-value">{match}</span>
        ));
      }

      str.push(<span key={`prop-${text}-${prop}-${type}`} className="prop">{prop}</span>);

      txt = str;
    }

    return txt || text;
  }

  return (
    <LinkedHeading as={as} className={clsx('api-heading', sticky ? 'sticky' : null, scope, type)} id={slug(text)} title={type}>
      <span className={clsx('api-descriptor')} aria-hidden="true">
        {scope && <span className="tag tag-scope">{scope}</span>}
        {type && <span className="tag tag-type">{type}</span>}
        {getBadges()}
      </span>
      <span className="api-heading-content">
        {formatText(text)}
        {getReturns()}
      </span>
    </LinkedHeading>
  );
};

ApiHeading.propTypes = {
  as: PropTypes.string,
  type: PropTypes.oneOf(['class', 'property', 'event', 'function', 'module', 'getter', 'setter']),
  scope: PropTypes.oneOf(['static', 'instance']),
  text: PropTypes.string.isRequired,
  returns: PropTypes.string,
  link: PropTypes.string,
  since: PropTypes.string,
  deprecated: PropTypes.string,
  sticky: PropTypes.bool
};

ApiHeading.defaultProps = {
  as: 'h4',
  sticky: false
};

export default ApiHeading;
