import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generates page numbers for pagination with ellipsis
 * @param {number} currentPage - Current page number (1-based)
 * @param {number} totalPages - Total number of pages
 * @returns {(number|string)[]} Array of page numbers and ellipsis strings
 */
export function getPageNumbers(currentPage, totalPages) {
  const maxVisiblePages = 5
  const rangeWithDots = []

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i)
    }
  } else {
    rangeWithDots.push(1)

    if (currentPage <= 3) {
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push("...", totalPages)
    } else if (currentPage >= totalPages - 2) {
      rangeWithDots.push("...")
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
    } else {
      rangeWithDots.push("...")
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push("...", totalPages)
    }
  }

  return rangeWithDots
}
