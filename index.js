class Node {
    constructor(data) {
        this.parent = null;
        this.data = data;
        this.children = [];
    };

    addChildren(node) {
        node.setParent(this);
        this.children.push(node);
    };

    getKind() {
        return this.data.kind;
    };

    getValue() {
        return this.data.value;
    };

    getStatus() {
        return this.data.status;
    };

    getChildren() {
        return this.children;
    };

    getData() {
        return this.data;
    };

    setParent(node) {
        this.parent = node;
    };
};

const isEqual = (node, data) => {
    return node.getKind() === data.kind && node.getValue() === data.value;
};

const findNode = (node, data) => {
    if(node == null) return null;
    
    if(isEqual(node, data)) {
        return node;
    }

    node.getChildren().forEach((child) => {
        const keyNode = findNode(child, data);
        if(keyNode !== null) return keyNode;
    });

    return null;
};

const findChild = (node, data) => {
    if(node === null) {
        // console.log('empty node');
        return null;
    }

    for(const child of node.getChildren()) {
        if(isEqual(child, data)) {
            // console.log('returning child: ', child);
            return child;
        }
    }

    // console.log('returning null');
    return null;
};

const listAllVariants = (root, attributes, attributeKind) => {
    let previousNode = root;
    let children = [];
    
    for(const attribute of attributes) {
        let nodeToConsider = findChild(previousNode, attribute);
        nodeToConsider = nodeToConsider || previousNode.getChildren()[0];

        children = [...children, ...nodeToConsider.parent.getChildren()];    
        
        previousNode = nodeToConsider;
    };

    return children;
};

const main = (variants, attributesOrder, selectedVariants) => {
    const rootNode = new Node({
        kind: 'root',
        value: 'root',
        status: 'root'
    });

    // build tree for each variant attribute values
    variants.forEach((variant) => {
        let previousNode = null;

        attributesOrder.forEach((attributeKind, i) => {
            // add tree nodes based on attributes order
            const variantAttributeData = variant.attributes.find((item) => item.kind === attributeKind);
            if(i === attributesOrder.length-1) variantAttributeData['status'] = variant.stockStatus;

            // console.log('attribute: ', variantAttributeData);
            if(variantAttributeData) {
                const parentNode = i === 0 ? rootNode : previousNode;

                // console.log('parent node: ', parentNode.getData());

                let currentNode = findChild(parentNode, variantAttributeData);
                // if(currentNode) console.log('current node: ', currentNode.getData());
                if(currentNode === null) {
                    // console.log('node not found');
                    currentNode = new Node(variantAttributeData);
                    parentNode.addChildren(currentNode);
                }
                
                previousNode = currentNode;
                // console.log('--------------------------------');
            }
        });
    });

    const variantNodes = listAllVariants(rootNode, selectedVariants, 'color');
    console.log('------------------- Available Variants ------------')
    variantNodes.forEach((node) => {
        console.log(node.getData());
    });
};

import { variantsWithMultipleAttributes, allVariants, attributesOrder, selectedVariants } from "./data.js";

main(variantsWithMultipleAttributes, attributesOrder, selectedVariants);