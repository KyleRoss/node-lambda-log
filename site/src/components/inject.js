import React from 'react';

function inject(Component, props) {
  return class extends React.Component {
    render() {
      return (
        <Component
          {...props}
          {...this.props}
        />
      );
    }
  };
}

export default inject;
