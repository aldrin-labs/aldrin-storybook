import { useEffect } from 'react';

interface HadnlerValue {
    key: string
}
export function useKeyPress(targetKey: string, action: () => void): void {
    function downHandler(v: HadnlerValue): void {
        const { key } = v
        if (key === targetKey) {
            action();
        }
    }
    // If released key is our target key then set to false
    // const upHandler = (v: HadnlerValue): void => {
    //     const { key } = v
    //     if (key === targetKey) {
    //         setKeyPressed(false);
    //     }
    // };
    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        // window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            // window.removeEventListener('keyup', upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount
}