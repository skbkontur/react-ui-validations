'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var customAcceptAttribute = function customAcceptAttribute(prevResult) {
    return prevResult;
};
var attributeWhiteList = null;

var ReactTypeOfWork = {
    IndeterminateComponent: 0,
    FunctionalComponent: 1,
    ClassComponent: 2,
    HostRoot: 3,
    HostPortal: 4,
    HostComponent: 5,
    HostText: 6,
    CoroutineComponent: 7,
    CoroutineHandlerPhase: 8,
    YieldComponent: 9,
    Fragment: 10
};

// Inlined from ReactTypeOfSideEffect
var PerformedWork = 1;

if (typeof ReactSeleniumTesting !== 'undefined') {
    if (ReactSeleniumTesting && ReactSeleniumTesting.acceptAttribute && typeof ReactSeleniumTesting.acceptAttribute === 'function') {
        customAcceptAttribute = ReactSeleniumTesting.acceptAttribute;
    }

    if (ReactSeleniumTesting && ReactSeleniumTesting.attributeWhiteList && _typeof(ReactSeleniumTesting.attributeWhiteList) === 'object') {
        attributeWhiteList = ReactSeleniumTesting.attributeWhiteList;
    }
}

function extendStaticObject(base, overrides) {
    var oldBase = Object.assign({}, base);
    for (var _iterator = Object.keys(overrides), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
        }

        var overrideKey = _ref;

        base[overrideKey] = overrides[overrideKey](oldBase);
    }
}

function injectReactDevToolsHook(injectModule, injectFiberHanlers) {
    if (!global.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        global.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
            inject: function inject() {},
            supportsFiber: true,
            onCommitFiberRoot: function onCommitFiberRoot() {}
        };
    }
    var oldInject = global.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject;
    global.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function (x) {
        var ReactMount = x.Mount;
        if (oldInject) {
            var id = oldInject.call(global.__REACT_DEVTOOLS_GLOBAL_HOOK__, x);
        }
        injectModule(x);
        // Return id for React Dev Tools
        return id;
    };
    injectFiberHanlers(global.__REACT_DEVTOOLS_GLOBAL_HOOK__);
}

if (process.env.enableReactTesting) {
    global.ReactTesting = {
        addRenderContainer: function addRenderContainer() {},
        removeRenderContainer: function removeRenderContainer() {}
    };
    injectReactDevToolsHook(exposeReactInternalsIntoDomHook, injectFiberHanlers);
}

// ====================================================
// ==================== COMMON =========================
// ====================================================

function appendToSet(attrContainer, name, value) {
    if (value === null) return;
    var attributeStringValue = attrContainer[name];
    var set = (attributeStringValue || '').split(' ').filter(function (x) {
        return x !== '';
    });
    if (!set.includes(value)) {
        attrContainer[name] = (attributeStringValue ? attributeStringValue + ' ' : '') + value;
    }
}

function acceptProp(componentName, propName, propValue) {
    var result = !propName.startsWith('$$') && !propName.startsWith('on') && propName !== 'children' && propName !== 'data-tid' && typeof propValue !== 'function';
    if (!result) {
        return false;
    }
    if (attributeWhiteList != null) {
        if (attributeWhiteList[propName] == null) {
            result = false;
        } else {
            if (!attributeWhiteList[propName].every(function (componentNamePattern) {
                return acceptPattern(componentNamePattern, componentName);
            })) {
                result = false;
            }
        }
    }
    if (customAcceptAttribute != null) {
        result = customAcceptAttribute(result, componentName, propName);
    }
    return result;
}

function acceptPattern(pattern, value) {
    if (pattern == null) {
        return false;
    }
    if (typeof pattern === 'string') {
        return value === pattern;
    }
    if (typeof pattern.test === 'function') {
        return pattern.test(value);
    }
    return false;
}

function stringifySafe(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (value === undefined || value === null) {
        return '';
    }
    try {
        return JSON.stringify(value);
    } catch (e) {
        try {
            if (Array.isArray(value) && value.length > 0 && Array.isArray(value[0])) {
                return JSON.stringify(value.map(function (x) {
                    return x[0];
                }));
            }
        } catch (e) {
            return '';
        }
        return '';
    }
}

// ====================================================
// ==================== FIBER =========================
// ====================================================

function injectFiberHanlers(hook) {
    extendStaticObject(hook, {
        onCommitFiberRoot: function onCommitFiberRoot(base) {
            return function () {
                handleCommitFiberRoot.apply(undefined, arguments);
                if (base.onCommitFiberRoot) {
                    base.onCommitFiberRoot.apply(base, arguments);
                }
            };
        }
    });
}

function handleCommitFiberRoot(rendererID, root) {
    var current = root.current;
    var alternate = current.alternate;
    if (alternate) {
        var wasMounted = alternate.memoizedState != null && alternate.memoizedState.element != null;
        var isMounted = current.memoizedState != null && current.memoizedState.element != null;
        if (!wasMounted && isMounted) {
            handleMountFiber(current);
        } else if (wasMounted && isMounted) {
            handleUpdateFiber(current, alternate);
        } else if (wasMounted && !isMounted) {
            // Skip unmounting
        }
    } else {
        handleMountFiber(current);
    }
}

function handleUpdateFiber(nextFiber, prevFiber) {
    var hasChildOrderChanged = false;
    if (nextFiber.child !== prevFiber.child) {
        var nextChild = nextFiber.child;
        var prevChildAtSameIndex = prevFiber.child;
        while (nextChild) {
            if (nextChild.alternate) {
                var prevChild = nextChild.alternate;
                handleUpdateFiber(nextChild, prevChild);
                if (!hasChildOrderChanged && prevChild !== prevChildAtSameIndex) {
                    hasChildOrderChanged = true;
                }
            } else {
                handleMountFiber(nextChild);
                if (!hasChildOrderChanged) {
                    hasChildOrderChanged = true;
                }
            }
            nextChild = nextChild.sibling;
            if (!hasChildOrderChanged && prevChildAtSameIndex != null) {
                prevChildAtSameIndex = prevChildAtSameIndex.sibling;
            }
        }
        if (!hasChildOrderChanged && prevChildAtSameIndex != null) {
            hasChildOrderChanged = true;
        }
    }
    updateIfNecessaryFiberNode(nextFiber, hasChildOrderChanged);
}

function handleMountFiber(fiber) {
    var node = fiber;
    outer: while (true) {
        if (node.child) {
            node.child.return = node;
            node = node.child;
            continue;
        }
        mountFiberNode(node);
        if (node == fiber) {
            return;
        }
        if (node.sibling) {
            node.sibling.return = node.return;
            node = node.sibling;
            continue;
        }
        while (node.return) {
            node = node.return;
            mountFiberNode(node);
            if (node == fiber) {
                return;
            }
            if (node.sibling) {
                node.sibling.return = node.return;
                node = node.sibling;
                continue outer;
            }
        }
        return;
    }
}

function mountFiberNode(node) {
    syncDomNodeWithFiberNode(node);
}

function updateIfNecessaryFiberNode(node, hasChildOrderChanged) {
    if (!hasChildOrderChanged && !hasDataChanged(node.alternate, node)) {
        return;
    }
    syncDomNodeWithFiberNode(node);
}

function syncDomNodeWithFiberNode(node) {
    var attrs = {};
    var visitedNodes = [];
    if (node.tag === 4 && node.sibling) {
        var domElement = findDomElementByFiberNode(node.sibling);
        var targetDomElement = findDomElementByFiberNode(node.sibling.return);
        fillAttrsForDomElementByFiberNodeRecursive(attrs, node.sibling, visitedNodes, domElement);
        fillAttrsForDomElementByFiberNodeRecursive(attrs, node.sibling.return, visitedNodes, targetDomElement);
        if (domElement != null) {
            if (typeof domElement.setAttribute === 'function') {
                for (var attrName in attrs) {
                    domElement.setAttribute(attrName, attrs[attrName]);
                }
            }
        }
    } else {
        var _domElement = findDomElementByFiberNode(node);
        fillAttrsForDomElementByFiberNodeRecursive(attrs, node, visitedNodes, _domElement);
        if (_domElement != null) {
            if (typeof _domElement.setAttribute === 'function') {
                for (var attrName in attrs) {
                    _domElement.setAttribute(attrName, attrs[attrName]);
                }
            }
        }
    }
}

function hasDataChanged(prevFiber, nextFiber) {
    if (prevFiber.tag === ReactTypeOfWork.ClassComponent) {
        if ((nextFiber.effectTag & PerformedWork) !== PerformedWork) {
            return false;
        }
        if (prevFiber.stateNode.context !== nextFiber.stateNode.context) {
            return true;
        }
        if (nextFiber.updateQueue != null && nextFiber.updateQueue.hasForceUpdate) {
            return true;
        }
    }
    return prevFiber.memoizedProps !== nextFiber.memoizedProps || prevFiber.memoizedState !== nextFiber.memoizedState || prevFiber.ref !== nextFiber.ref || prevFiber._debugSource !== nextFiber._debugSource;
}

function findDomElementByFiberNode(node) {
    var result = null;
    if (typeof node.setAttribute === 'function') {
        return node;
    }
    if (result == null && node._node) {
        result = findDomElementByFiberNode(node._node);
    }
    if (result == null && node.stateNode) {
        result = findDomElementByFiberNode(node.stateNode);
    }
    if (result == null && node.child) {
        result = findDomElementByFiberNode(node.child);
    }
    return result;
}

function fillAttrsForDomElementByFiberNodeRecursive(attrContainer, node, visitedNodes, domElement) {
    if (node == null || visitedNodes.includes(node)) {
        return;
    }
    visitedNodes.push(node);
    fillAttrsForDomElementByFiberNode(attrContainer, node);
    if (node.tag === 1 || node.tag === 2 || node.tag === 12 || node.tag === 13 || node.tag === 10) {
        fillAttrsForDomElementByFiberNodeRecursive(attrContainer, node.child, visitedNodes);
    } else if (node.tag === 5) {
        // I dont know what does it mean
    } else if (node.tag === 4) {
        // I dont know what does it mean
    } else {}
    if (node.return) {
        var parentDomElement = findDomElementByFiberNode(node.return);
        if (parentDomElement == domElement) {
            fillAttrsForDomElementByFiberNodeRecursive(attrContainer, node.return, visitedNodes, domElement);
        }
    }
    if (node && node.memoizedProps && node.key === "portal-ref") {
        if (node.return) {
            var _parentDomElement = findDomElementByFiberNode(node.return);
            fillAttrsForDomElementByFiberNodeRecursive(attrContainer, node.return, visitedNodes, _parentDomElement);
        }
    }
}

function fillAttrsForDomElementByFiberNode(attrContainer, node) {
    var instanceProps = node.memoizedProps;
    var componentName = getFiberComponentName(node);
    if (componentName) {
        appendToSet(attrContainer, 'data-comp-name', componentName);
    }
    if (instanceProps != null) {
        if (instanceProps['data-tid']) {
            appendToSet(attrContainer, 'data-tid', instanceProps['data-tid']);
        }
        for (var prop in instanceProps) {
            if (acceptProp(componentName, prop, instanceProps[prop])) {
                attrContainer['data-prop-' + prop] = stringifySafe(instanceProps[prop]);
            }
        }
    } else {}
}

function getFiberComponentName(node) {
    if (node.type) {
        return node.type.name;
    }
}

// ====================================================
// =============== REACT (<16.0.0) ====================
// ====================================================

function exposeReactInternalsIntoDomHook(_ref2) {
    var Mount = _ref2.Mount,
        Reconciler = _ref2.Reconciler;

    var ReactMount = Mount;
    if (Reconciler == null) {
        return;
    }
    extendStaticObject(Reconciler, {
        receiveComponent: function receiveComponent(base) {
            return function (instance, nextElement, transaction, context) {
                base.receiveComponent(instance, nextElement, transaction, context);

                var prevElement = instance._currentElement;
                if (nextElement === prevElement && context === instance._context) {
                    return;
                }

                if (instance._currentElement && instance._currentElement.type) {
                    var domElement = getTargetNode(instance, ReactMount);
                    updateDomElement(domElement, instance, false);
                }
            };
        },

        mountComponent: function mountComponent(base) {
            return function (instance, tr, host, hostParent, hostContainerInfo, context) {
                for (var _len = arguments.length, rest = Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
                    rest[_key - 6] = arguments[_key];
                }

                var result = base.mountComponent.apply(base, [instance, tr, host, hostParent, hostContainerInfo, context].concat(rest));
                if (typeof result === 'string') {
                    // React 0.14.*
                    var resultDomElement = createDomFromString(result);
                    if (!resultDomElement) {
                        return result;
                    }
                    updateDomElement(resultDomElement, instance, true);
                    return resultDomElement.outerHTML;
                } else if (result.node) {
                    // React 15.*
                    updateDomElement(result.node, instance, true);
                }
                return result;
            };
        }
    });
}

function createDomFromString(s) {
    var rootDomElement;
    if (s.startsWith('<tbody') || s.startsWith('<tfoot') || s.startsWith('<thead')) {
        rootDomElement = document.createElement('table');
    } else if (s.startsWith('<th') || s.startsWith('<td')) {
        rootDomElement = document.createElement('tr');
    } else if (s.startsWith('<tr')) {
        rootDomElement = document.createElement('thead');
    } else {
        rootDomElement = document.createElement('div');
    }
    rootDomElement.innerHTML = s;
    return rootDomElement.childNodes[0];
}

function getTargetNode(instance, ReactMount) {
    var result = getDomHostNode(instance);
    if (!result && typeof instance._rootNodeID === 'string') {
        try {
            result = ReactMount.getNode(instance._rootNodeID);
        } catch (e) {
            return null;
        }
    }
    return result;
}

function getComponentName(instance) {
    if (!instance._currentElement || !instance._currentElement.type) {
        return null;
    }
    return instance._currentElement.type.name;
}

function updateDomElement(domElement, instance, isMounting) {
    if (!domElement || typeof domElement.setAttribute !== 'function') {
        return;
    }
    var attrs = fillPropsForDomElementRecursive({}, instance);
    for (var attrName in attrs) {
        domElement.setAttribute(attrName, attrs[attrName]);
    }
}

function fillPropsForDomElementRecursive(attrContainer, instance) {
    attrContainer = fillPropsForDomElement(attrContainer, instance);
    var ownerInstance = instance._currentElement && instance._currentElement._owner;
    if (ownerInstance) {
        if (sameHostNodes(ownerInstance, instance)) {
            attrContainer = fillPropsForDomElementRecursive(attrContainer, ownerInstance);
        }
    }
    return attrContainer;
}

function fillPropsForDomElement(attrContainer, instance) {
    var instanceProps = instance._currentElement && instance._currentElement.props;
    var componentName = getComponentName(instance);
    if (componentName) {
        appendToSet(attrContainer, 'data-comp-name', componentName);
    }
    if (instanceProps) {
        if (instanceProps['data-tid']) {
            appendToSet(attrContainer, 'data-tid', instanceProps['data-tid']);
        }
        for (var prop in instanceProps) {
            if (acceptProp(componentName, prop, instanceProps[prop])) {
                attrContainer['data-prop-' + prop] = stringifySafe(instanceProps[prop]);
            }
        }
    }
    return attrContainer;
}

function sameHostNodes(instance1, instance2) {
    if (typeof instance1._rootNodeID === 'string' || typeof instance2._rootNodeID === 'string') {
        // React 0.14.*
        var nodeId1 = instance1._rootNodeID;
        var nodeId2 = instance2._rootNodeID;
        if (nodeId1 !== null && nodeId2 !== null) {
            return nodeId1 === nodeId2;
        }
    }

    var node1 = getDomHostNode(instance1);
    var node2 = getDomHostNode(instance2);
    return node1 !== null && node2 !== null && node1 === node2;
}

function getDomHostNode(instance) {
    if (instance._hostNode) {
        return instance._hostNode;
    }
    if (instance._renderedComponent) {
        return getDomHostNode(instance._renderedComponent);
    }
    return null;
}