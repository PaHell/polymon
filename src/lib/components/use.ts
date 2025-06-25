export const clickOutside = function (node: HTMLElement, callback: (event: MouseEvent) => void) {
      const handleClick = (event: MouseEvent) => {
            if (node && !node.contains(event.target) && !event.defaultPrevented) {
                  callback(event);
            }
      }
      document.addEventListener('click', handleClick, true);
      return {
            destroy() {
                  document.removeEventListener('click', handleClick, true);
            }
      }
}