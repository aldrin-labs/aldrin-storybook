import React from "react";
import { storiesOf } from "@storybook/react";
//import App from "../src/App.tsx";
//import Button from "../src/components/Button/Button.tsx";
//import Input from "../src/components/Input/Input.tsx";
import App from "../src/App";
import Button from "../src/components/Button/Button";
import Input from "../src/components/Input/Input";
storiesOf("Components", module)
	.add("Button",() => <Button>click</Button>)
	.add("Input",() => <Input placeholder="Input"/>)
	.add("App",() => <App />);