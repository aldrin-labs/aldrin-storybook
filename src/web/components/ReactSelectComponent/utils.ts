export const handleRef = node => {
  // this is a little bit hacky but it' the only way to prevent open on click
  // fix openMenuOnClick so it does what it should do
  if (node) {
    const select = node.select.select;
    select.onControlMouseDown = event => {
      const { openMenuOnClick } = select.props;
      if (!select.state.isFocused) {
        if (openMenuOnClick) {
          select.openAfterFocus = true;
        }
        select.focusInput();
      } else if (!select.props.menuIsOpen) {

        // only added this if
        if (openMenuOnClick) {
          select.openMenu("first");
        }

        //select.openMenu("first");
      } else {
        select.onMenuClose();
      }

      if (event.target.tagName !== "INPUT") {
        event.preventDefault();
      }
    };
  }
};
