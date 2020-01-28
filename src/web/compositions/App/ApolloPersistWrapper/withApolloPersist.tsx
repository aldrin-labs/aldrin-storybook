import * as React from "react";
import { ApolloPersistContext } from "./ApolloPersistWrapper";

export function withApolloPersist(Component: React.ComponentType<any>) {
  return function ApolloPersistComponent(props: any) {
    return (
      <ApolloPersistContext.Consumer>
        {contexts => <Component {...props} {...contexts} />}
      </ApolloPersistContext.Consumer>
    );
  };
}
