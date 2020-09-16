import React from "react";
import Menu from "./Menu";
import GridMenu from "./components/GridMenu";
import { PbRenderElementPlugin } from "@webiny/app-page-builder/types";
import { PbPageElementMenuComponentPlugin } from "@webiny/app-page-builder/types";

export default [
    {
        name: "pb-render-page-element-menu",
        type: "pb-render-page-element",
        elementType: "menu",
        render({ element, theme }) {
            console.log("INDEX FROM RENDER 1::::::::::::::");
            return <Menu data={element.data} theme={theme} />;
        }
    } as PbRenderElementPlugin,
    {
        name: "pb-page-element-menu-component-default",
        type: "pb-page-element-menu-component",
        title: "Grid list",
        componentName: "default",
        component: GridMenu
    } as PbPageElementMenuComponentPlugin
];