class Selector {
  static get pattern() { return /([-a-zA-Z0-9]*)((?:#[-a-zA-Z0-9]+)?)((?:\.[-a-zA-Z0-9]+)*)((?:\[[a-z][-a-z0-9]*\])*)/; }
  constructor(input){
    const result = Selector.pattern.exec(input);

    this.name = '';
    this.id = '';
    this.classes = [];
    this.attributes = [];

    if(result){
      if(result[1]){
        this.name = result[1];
      }
      if(result[2]){
        this.id = result[2].substr(1);
      }
      if(result[3]){
        this.classes = result[3].split('.').filter(x=>x);
      }
      if(result[4]){
        let matcher = /(?:\[([^\[\]]+)\])/g;
        let ar = null;
        while(ar = matcher.exec(result[4])){
          this.attributes.push(ar[1]);
        }
      }
    }
  }
}

class Node {
  /**
   * 
   * @constructs Node
   * @param {string} name 
   * @param {object} attributes
   */
  constructor(name, attributes){
    /**
     * @prop {string} name
     * @memberof Node
     */
    this.name = name || 'NODE';
    /**
     * @prop {object} attributes
     * @memberof Node
     */
    this.attributes = attributes || {};
    /**
     * @prop {string} id
     * @memberof Node
     */
    this.id = this.attributes.id || null;
    /**
     * @prop {string[]} classNames
     * @memberof Node
     */
    this.classNames = typeof this.attributes['class'] === 'string' ? this.attributes['class'].split(/\s+/g) : [];
  }
  /**
   * 
   * @param {Selector} selector 
   * @returns {boolean}
   */
  satisfies(selector){
    let isSatisfied = true;
    if(selector.name && selector.name !== this.name){
      isSatisfied = false;
    }
    if(selector.id && selector.id !== this.id){
      isSatisfied = false;
    }
    if(isSatisfied && selector.classes.length){
      isSatisfied = selector.classes.map(cn => this.classNames.indexOf(cn)>=0)
        .reduce((pv, cv)=> pv && cv, true);
    }
    if(isSatisfied && selector.attributes.length){
      isSatisfied = selector.attributes.map(an => this.attributes.hasOwnProperty(an))
        .reduce((prev, curr) => prev && curr, true);
    }
    return isSatisfied;
  }
}

class NodeTree{
  constructor(){
    this.nodes = [];
  }
  /**
   * Find the last index of something in an array
   * @param {Array} arr 
   * @param {Function} predicate
   * @param {number} idx
   * @returns {number}
   */
  static findLastIndex(arr, predicate, startIndex){
    if(startIndex == null){
      startIndex = arr.length - 1;
    }
    for(let idx = startIndex; idx>=0 && idx < arr.length; idx--){
      if(predicate(arr[idx])){
        return idx;
      }
    }
    return -1;
  }

  /**
   * 
   * @param {string} name 
   * @param {object} attributes 
   */
  addNode(name, attributes){
    this.nodes.push(new Node(name, attributes))
  }
  /**
   * Remove a node from the tree
   * @param {string} name 
   */
  popNode(name){
    const idx = NodeTree.findLastIndex(this.nodes, n => n.name === name);
    if(idx>=0){
      while(this.nodes.length && this.nodes.length >= idx){
        this.nodes.pop();
      }
    }
  }
  /**
   * Determine if the selector can be satisfied by the current state of the NodeTree
   * @param {string} selector - the selector to satisfy
   * @param {number} [startIndex] - the optional startIndex to test
   * @returns {boolean}
   */
  satisfies(selector, startIndex){
    if(!selector || typeof selector !== 'string'){
      throw new Error('Invalid selector');
    }

    if(startIndex == null){
      startIndex = this.nodes.length - 1;
    } else {
      if(typeof startIndex !== 'number' || startIndex < 0){
        throw new Error('Invalid startIndex');
      } 
    }

    if(startIndex < 0){
      return false;
    }

    const items = selector.replace(/\s*>\s*/g, '>').split(' ');

    if(items.length){
      let treeIndex = startIndex;
      do{
        const currItem = items.pop();
        if(currItem.indexOf('>') >= 0){
          const subItems = currItem.split('>').reverse();
          if(subItems.length){
            const subtreeSatisfied = subItems.map(si => {
              let x = new Selector(si);
              let satisfiedAt = NodeTree.findLastIndex(this.nodes, node => node.satisfies(x), treeIndex);
              return satisfiedAt;
            }).reduce((prev, curr) => {
              if(curr < 0 || prev < 0){
                return -1;
              }
              if(prev == null){
                return curr;
              } else {
                if(curr === prev - 1){
                  return curr;
                } else {
                  return -1
                }
              }
            });

            if(subtreeSatisfied >= 0){
              treeIndex = subtreeSatisfied - 1;
            } else {
              return false;
            }
          } else {
            throw new Error('Bad selector, no selectors found after splitting descendent node selector');
          }
        } else {
          let currSelector = new Selector(currItem);
          let satisfyingNode = NodeTree.findLastIndex(this.nodes, node => node.satisfies(currSelector), treeIndex);
          if(satisfyingNode < 0){
            return false;
          } else {
            treeIndex = satisfyingNode - 1;
          }
        }
      }while(items.length);
      return true;
    } else {
      throw new Error('Bad selector, no items specified to select.');
    }
  }
  toString(){
    return this.nodes.map(n => n.name).join('>');
  }
}

module.exports = {
  Selector,
  Node,
  NodeTree
};