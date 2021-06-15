// User Model

import { Model } from '@vuex-orm/core'

export default class GoogleUser extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'googleusers'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id: this.attr(null),
      email: this.attr(undefined),
      name: this.attr(undefined),
      family_name: this.attr(undefined),
      given_name: this.attr(undefined),
      thumbnail: this.attr(undefined),

      email_verified: this.attr(undefined),
      exp: this.attr(undefined),
      iat: this.attr(undefined),
      iss: this.attr(undefined),
      jti: this.attr(undefined),
      locale: this.attr(undefined),
      sub: this.attr(undefined),
    }
  }
}
