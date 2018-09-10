import React from "react";
import { storiesOf } from "@storybook/react";
import App from "../src/App.tsx";
import Button from "../src/components/Button/Button.tsx";
import Input from "../src/components/Input/Input.tsx";
storiesOf("Components", module)
	.add("Button",() => <Button>click</Button>)
	.add("Input",() => <Input placeholder="Input"/>)
	.add("App",() => <App />);