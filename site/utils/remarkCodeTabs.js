const remarkCodeTabs = function remarkCodeTabs() {
  function renderTabs(tabs, nodes) {
    const tabNodes = [];

    tabNodes.push({
      type: 'jsx',
      value: '<Tabs className="code-tabs" defaultIndex={0}>'
    });

    tabNodes.push({
      type: 'jsx',
      value: '<TabList className="code-tabs-tabs">'
    });

    tabs.forEach(tab => {
      tabNodes.push({
        type: 'jsx',
        value: `<Tab className="code-tabs-tab">${nodes[tab.start].children[0].value}</Tab>`
      });
    });

    tabNodes.push({
      type: 'jsx',
      value: '</TabList>'
    });

    tabNodes.push({
      type: 'jsx',
      value: '<TabPanels className="code-tabs-panels">'
    });

    tabs.forEach(tab => {
      tabNodes.push({
        type: 'jsx',
        value: '<TabPanel className="code-tabs-panel">'
      });

      tabNodes.push(...nodes.slice(tab.start + 1, tab.end));

      tabNodes.push({
        type: 'jsx',
        value: '</TabPanel>'
      });
    });

    tabNodes.push({
      type: 'jsx',
      value: '</TabPanels>'
    });

    tabNodes.push({
      type: 'jsx',
      value: '</Tabs>'
    });

    return tabNodes;
  }

  function findTabs(node, index, parent) {
    const tabs = [];

    let depth;

    let tab;
    const { children } = parent;

    while(++index < children.length) {
      const child = children[index];

      if(child.type === 'heading') {
        if(depth === null || depth === undefined) {
          depth = child.depth;
        }

        if(child.depth < depth) {
          tab.end = index;
          break;
        }

        if(child.depth === depth) {
          if(tab) {
            tab.end = index;
          }

          tab = {};
          tab.start = index;
          tab.end = children.length;
          tabs.push(tab);
        }
      }

      if(child.type === 'comment' && child.value.trim() === '/tabs') {
        tab.end = index;
        break;
      }
    }

    return tabs;
  }

  return tree => {
    const { children } = tree;
    let index = -1;
    while(++index < children.length) {
      const child = children[index];
      if(child.type === 'comment' && child.value.trim() === 'tabs') {
        const tabs = findTabs(child, index, tree);
        const { start } = tabs[0];
        const { end } = tabs[tabs.length - 1];

        if(tabs.length > 0) {
          const nodes = renderTabs(tabs, children);
          children.splice(start, end - start, ...nodes);
          index += nodes.length;
        }
      }
    }
  };
};

export default remarkCodeTabs;
