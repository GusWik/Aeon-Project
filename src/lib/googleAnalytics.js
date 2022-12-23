class GoogleAnalytics {
  sendToGtm(data) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(data)
  }
  sendToGa(data) {
    window.ga('send', data)
  }
  gtmAvailable() {
    return window.google_tag_manager
  }
  gaAvailable() {
    return typeof window.ga === 'function'
  }
  pageview({ path, title }) {
    if (this.gtmAvailable()) {
      this.sendToGtm({
        event: 'ga_pageview',
        page: path,
        title,
      })
    }
    if (this.gaAvailable()) {
      this.sendToGa({
        hitType: 'pageview',
        page: path,
        title,
      })
    } else {
      console.log('page tracking agent not found', { path, title })
    }
  }
  click({ action, label, value = 1 }) {
    if (this.gtmAvailable()) {
      this.sendToGtm({
        event: 'ga_event',
        category: 'click',
        action,
        label,
        value,
      })
    } else if (this.gaAvailable()) {
      this.sendToGa({
        hitType: 'event',
        eventCategory: 'click',
        eventAction: action,
        eventLabel: label,
        eventValue: value,
      })
    } else {
      console.log('event tracking agent not found', { action, label, value })
    }
  }
}

export const googleAnalytics = new GoogleAnalytics()
