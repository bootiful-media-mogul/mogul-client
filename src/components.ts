import { types } from 'sass'
import Number = types.Number

/**
 * this function renders an element (`us`) in the gutter to the right of a given HTML form element.
 */
export function formInputForLabel(childElement: HTMLElement) {
  // const childElement = iconElement.parentElement as HTMLElement

  const forElementIdName = childElement.getAttribute('for')
  if (forElementIdName != null && forElementIdName.toString().trim() != '')
    return document.getElementById(forElementIdName) as HTMLElement
  return null
}

export function positionIconRelativeToFormInputForParentLabel(iconElement: HTMLElement,
                                                              leftPositionProcessorFn: (value) => Number,
                                                              topPositionProcessorFn: (value) => Number) {
  const leftCallbackFn = leftPositionProcessorFn ? leftPositionProcessorFn : i => i
  const topCallbackFn = topPositionProcessorFn ? topPositionProcessorFn : i => i
  const formElement = formInputForLabel(iconElement.parentElement as HTMLElement)

  if (formElement === null) return

  const resizeFunction = () => {
    iconElement.style.left = leftCallbackFn(formElement.offsetWidth + iconElement.offsetWidth) + 'px'
    // iconElement.style.top = topCallbackFn(formElement.style.top) + 'px'
  }
  new ResizeObserver(resizeFunction).observe(formElement)
  resizeFunction()
}
