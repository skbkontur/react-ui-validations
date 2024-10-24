import * as React from "react";
import * as ReactDom from "react-dom";

import { Router, IndexRoute, Route, useRouterHistory } from "react-router";
import createHashHistory from "history/lib/createHashHistory";

import Layout from "docs/components/Layout";
import Api from "docs/components/Pages/Api.md";
import GettingStarted from "docs/components/Pages/GettingStarted.md";
import Description from "docs/components/Pages/Description.md";
import Examples from "docs/components/Pages/Examples";
import Concepts from "docs/components/Pages/Concepts";

import "docs/styles/reset.less";
import "docs/styles/typography.less";

const history = useRouterHistory(createHashHistory)();

ReactDom.render(
    <Router history={history}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Description} />
            {Examples.map(page => (
                <Route key={page.url} path={page.url} component={page.component} />
            ))}
            {Concepts.map(page => (
                <Route key={page.url} path={page.url} component={page.component} />
            ))}
            <Route path="api" component={Api}>
                <Route path="*" />
            </Route>
            <Route path="getting-started" component={GettingStarted}>
                <Route path="*" />
            </Route>
        </Route>
    </Router>,
    document.getElementById("content")
);
