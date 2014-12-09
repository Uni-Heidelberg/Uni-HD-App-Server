(function (window, angular, undefined) {
    'use strict';

    var urlBase = "/api";
    var authHeader = 'authorization';

    /**
     * @ngdoc overview
     * @name lbServices
     * @module
     * @description
     *
     * The `lbServices` module provides services for interacting with
     * the models exposed by the LoopBack server via the REST API.
     *
     */
    var module = angular.module("lbServices", ['ngResource']);

    /**
     * @ngdoc object
     * @name lbServices.User
     * @header lbServices.User
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `User` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "User",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/Users/:id",
                {'id': '@id'},
                {

                    /**
                     * @ngdoc method
                     * @name lbServices.User#login
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Login a user with username/email and password
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
                     *   Default value: `user`.
                     *
                     *  - `rememberMe` - `boolean` - Whether the authentication credentials
                     *     should be remembered in localStorage across app/browser restarts.
                     *     Default: `true`.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * The response body contains properties of the AccessToken created on login.
                     * Depending on the value of `include` parameter, the body may contain additional properties:
                     *
                     *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
                     *
                     *
                     */
                    "login": {
                        url: urlBase + "/Users/login",
                        method: "POST",
                        params: {
                            include: "user"
                        },
                        interceptor: {
                            response: function (response) {
                                var accessToken = response.data;
                                LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
                                LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
                                LoopBackAuth.save();
                                return response.resource;
                            }
                        }
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#logout
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Logout a user with access token
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "logout": {
                        url: urlBase + "/Users/logout",
                        method: "POST",
                        interceptor: {
                            response: function (response) {
                                LoopBackAuth.clearUser();
                                LoopBackAuth.clearStorage();
                                return response.resource;
                            }
                        }
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#confirm
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Confirm a user registration with email verification token
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `uid` – `{string}` -
                     *
                     *  - `token` – `{string}` -
                     *
                     *  - `redirect` – `{string}` -
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "confirm": {
                        url: urlBase + "/Users/confirm",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#resetPassword
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Reset password for a user with email
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "resetPassword": {
                        url: urlBase + "/Users/reset",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__findById__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find a related item by id for accessTokens
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `fk` – `{*}` - Foreign key for accessTokens
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__findById__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens/:fk",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__destroyById__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Delete a related item by id for accessTokens
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `fk` – `{*}` - Foreign key for accessTokens
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "prototype$__destroyById__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens/:fk",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__updateById__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update a related item by id for accessTokens
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `fk` – `{*}` - Foreign key for accessTokens
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__updateById__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens/:fk",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__get__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Queries accessTokens of User.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `filter` – `{object=}` -
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__get__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__create__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Creates a new instance in accessTokens of this model.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__create__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__delete__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Deletes all accessTokens of this model.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "prototype$__delete__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__count__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Counts accessTokens of User.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "prototype$__count__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#create
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/Users",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#upsert
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/Users",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#exists
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/Users/:id/exists",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#findById
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/Users/:id",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#find
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/Users",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#findOne
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/Users/findOne",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#updateAll
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/Users/update",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#deleteById
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/Users/:id",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#count
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/Users/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$updateAttributes
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/Users/:id",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#getCurrent
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Get data of the currently logged user. Fail with HTTP result 401
                     * when there is no user logged in.
                     *
                     * @param {function(Object,Object)=} successCb
                     *    Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *    `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     */
                    "getCurrent": {
                        url: urlBase + "/Users" + "/:id",
                        method: "GET",
                        params: {
                            id: function () {
                                var id = LoopBackAuth.currentUserId;
                                if (id == null) id = '__anonymous__';
                                return id;
                            }
                        },
                        interceptor: {
                            response: function (response) {
                                LoopBackAuth.currentUserData = response.data;
                                return response.resource;
                            }
                        },
                        __isGetCurrentUser__: true
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.User#updateOrCreate
             * @methodOf lbServices.User
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `User` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.User#update
             * @methodOf lbServices.User
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.User#destroyById
             * @methodOf lbServices.User
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.User#removeById
             * @methodOf lbServices.User
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.User#getCachedCurrent
             * @methodOf lbServices.User
             *
             * @description
             *
             * Get data of the currently logged user that was returned by the last
             * call to {@link lbServices.User#login} or
             * {@link lbServices.User#getCurrent}. Return null when there
             * is no user logged in or the data of the current user were not fetched
             * yet.
             *
             * @returns {Object} A User instance.
             */
            R.getCachedCurrent = function () {
                var data = LoopBackAuth.currentUserData;
                return data ? new R(data) : null;
            };

            /**
             * @ngdoc method
             * @name lbServices.User#isAuthenticated
             * @methodOf lbServices.User
             *
             * @returns {boolean} True if the current user is authenticated (logged in).
             */
            R.isAuthenticated = function () {
                return this.getCurrentId() != null;
            };

            /**
             * @ngdoc method
             * @name lbServices.User#getCurrentId
             * @methodOf lbServices.User
             *
             * @returns {Object} Id of the currently logged-in user or null.
             */
            R.getCurrentId = function () {
                return LoopBackAuth.currentUserId;
            };

            /**
             * @ngdoc property
             * @name lbServices.User#modelName
             * @propertyOf lbServices.User
             * @description
             * The name of the model represented by this $resource,
             * i.e. `User`.
             */
            R.modelName = "User";


            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.Canteen
     * @header lbServices.Canteen
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `Canteen` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "Canteen",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/mensa/canteens/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use Canteen.sections.findById() instead.
                    "prototype$__findById__sections": {
                        url: urlBase + "/mensa/canteens/:id/sections/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use Canteen.sections.destroyById() instead.
                    "prototype$__destroyById__sections": {
                        url: urlBase + "/mensa/canteens/:id/sections/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use Canteen.sections.updateById() instead.
                    "prototype$__updateById__sections": {
                        url: urlBase + "/mensa/canteens/:id/sections/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use Canteen.sections() instead.
                    "prototype$__get__sections": {
                        url: urlBase + "/mensa/canteens/:id/sections",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use Canteen.sections.create() instead.
                    "prototype$__create__sections": {
                        url: urlBase + "/mensa/canteens/:id/sections",
                        method: "POST"
                    },

                    // INTERNAL. Use Canteen.sections.destroyAll() instead.
                    "prototype$__delete__sections": {
                        url: urlBase + "/mensa/canteens/:id/sections",
                        method: "DELETE"
                    },

                    // INTERNAL. Use Canteen.sections.count() instead.
                    "prototype$__count__sections": {
                        url: urlBase + "/mensa/canteens/:id/sections/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Canteen#create
                     * @methodOf lbServices.Canteen
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Canteen` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/mensa/canteens",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Canteen#upsert
                     * @methodOf lbServices.Canteen
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Canteen` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/mensa/canteens",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Canteen#exists
                     * @methodOf lbServices.Canteen
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/mensa/canteens/:id/exists",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Canteen#findById
                     * @methodOf lbServices.Canteen
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Canteen` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/mensa/canteens/:id",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Canteen#find
                     * @methodOf lbServices.Canteen
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Canteen` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/mensa/canteens",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Canteen#findOne
                     * @methodOf lbServices.Canteen
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Canteen` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/mensa/canteens/findOne",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Canteen#updateAll
                     * @methodOf lbServices.Canteen
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/mensa/canteens/update",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Canteen#deleteById
                     * @methodOf lbServices.Canteen
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/mensa/canteens/:id",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Canteen#count
                     * @methodOf lbServices.Canteen
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/mensa/canteens/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Canteen#prototype$updateAttributes
                     * @methodOf lbServices.Canteen
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - ImageBase id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Canteen` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/mensa/canteens/:id",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenSection.canteen() instead.
                    "::get::CanteenSection::canteen": {
                        url: urlBase + "/mensa/sections/:id/canteen",
                        method: "GET"
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.Canteen#updateOrCreate
             * @methodOf lbServices.Canteen
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Canteen` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.Canteen#update
             * @methodOf lbServices.Canteen
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.Canteen#destroyById
             * @methodOf lbServices.Canteen
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Canteen#removeById
             * @methodOf lbServices.Canteen
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.Canteen#modelName
             * @propertyOf lbServices.Canteen
             * @description
             * The name of the model represented by this $resource,
             * i.e. `Canteen`.
             */
            R.modelName = "Canteen";

            /**
             * @ngdoc object
             * @name lbServices.Canteen.sections
             * @header lbServices.Canteen.sections
             * @object
             * @description
             *
             * The object `Canteen.sections` groups methods
             * manipulating `CanteenSection` instances related to `Canteen`.
             *
             * Call {@link lbServices.Canteen#sections Canteen.sections()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.Canteen#sections
             * @methodOf lbServices.Canteen
             *
             * @description
             *
             * Queries sections of Canteen.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenSection` object.)
             * </em>
             */
            R.sections = function () {
                var TargetResource = $injector.get("CanteenSection");
                var action = TargetResource["::get::Canteen::sections"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Canteen.sections#count
             * @methodOf lbServices.Canteen.sections
             *
             * @description
             *
             * Counts sections of Canteen.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.sections.count = function () {
                var TargetResource = $injector.get("CanteenSection");
                var action = TargetResource["::count::Canteen::sections"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Canteen.sections#create
             * @methodOf lbServices.Canteen.sections
             *
             * @description
             *
             * Creates a new instance in sections of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenSection` object.)
             * </em>
             */
            R.sections.create = function () {
                var TargetResource = $injector.get("CanteenSection");
                var action = TargetResource["::create::Canteen::sections"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Canteen.sections#destroyAll
             * @methodOf lbServices.Canteen.sections
             *
             * @description
             *
             * Deletes all sections of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.sections.destroyAll = function () {
                var TargetResource = $injector.get("CanteenSection");
                var action = TargetResource["::delete::Canteen::sections"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Canteen.sections#destroyById
             * @methodOf lbServices.Canteen.sections
             *
             * @description
             *
             * Delete a related item by id for sections
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `fk` – `{*}` - Foreign key for sections
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.sections.destroyById = function () {
                var TargetResource = $injector.get("CanteenSection");
                var action = TargetResource["::destroyById::Canteen::sections"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Canteen.sections#findById
             * @methodOf lbServices.Canteen.sections
             *
             * @description
             *
             * Find a related item by id for sections
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `fk` – `{*}` - Foreign key for sections
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenSection` object.)
             * </em>
             */
            R.sections.findById = function () {
                var TargetResource = $injector.get("CanteenSection");
                var action = TargetResource["::findById::Canteen::sections"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Canteen.sections#updateById
             * @methodOf lbServices.Canteen.sections
             *
             * @description
             *
             * Update a related item by id for sections
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `fk` – `{*}` - Foreign key for sections
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenSection` object.)
             * </em>
             */
            R.sections.updateById = function () {
                var TargetResource = $injector.get("CanteenSection");
                var action = TargetResource["::updateById::Canteen::sections"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.CanteenSection
     * @header lbServices.CanteenSection
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `CanteenSection` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "CanteenSection",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/mensa/sections/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use CanteenSection.canteen() instead.
                    "prototype$__get__canteen": {
                        url: urlBase + "/mensa/sections/:id/canteen",
                        method: "GET"
                    },

                    // INTERNAL. Use CanteenSection.menus.findById() instead.
                    "prototype$__findById__menus": {
                        url: urlBase + "/mensa/sections/:id/menus/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use CanteenSection.menus.destroyById() instead.
                    "prototype$__destroyById__menus": {
                        url: urlBase + "/mensa/sections/:id/menus/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenSection.menus.updateById() instead.
                    "prototype$__updateById__menus": {
                        url: urlBase + "/mensa/sections/:id/menus/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenSection.menus() instead.
                    "prototype$__get__menus": {
                        url: urlBase + "/mensa/sections/:id/menus",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use CanteenSection.menus.create() instead.
                    "prototype$__create__menus": {
                        url: urlBase + "/mensa/sections/:id/menus",
                        method: "POST"
                    },

                    // INTERNAL. Use CanteenSection.menus.destroyAll() instead.
                    "prototype$__delete__menus": {
                        url: urlBase + "/mensa/sections/:id/menus",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenSection.menus.count() instead.
                    "prototype$__count__menus": {
                        url: urlBase + "/mensa/sections/:id/menus/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenSection#create
                     * @methodOf lbServices.CanteenSection
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenSection` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/mensa/sections",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenSection#upsert
                     * @methodOf lbServices.CanteenSection
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenSection` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/mensa/sections",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenSection#exists
                     * @methodOf lbServices.CanteenSection
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/mensa/sections/:id/exists",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenSection#findById
                     * @methodOf lbServices.CanteenSection
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenSection` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/mensa/sections/:id",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenSection#find
                     * @methodOf lbServices.CanteenSection
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenSection` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/mensa/sections",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenSection#findOne
                     * @methodOf lbServices.CanteenSection
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenSection` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/mensa/sections/findOne",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenSection#updateAll
                     * @methodOf lbServices.CanteenSection
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/mensa/sections/update",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenSection#deleteById
                     * @methodOf lbServices.CanteenSection
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/mensa/sections/:id",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenSection#count
                     * @methodOf lbServices.CanteenSection
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/mensa/sections/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenSection#prototype$updateAttributes
                     * @methodOf lbServices.CanteenSection
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - PersistedModel id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenSection` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/mensa/sections/:id",
                        method: "PUT"
                    },

                    // INTERNAL. Use Canteen.sections.findById() instead.
                    "::findById::Canteen::sections": {
                        url: urlBase + "/mensa/canteens/:id/sections/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use Canteen.sections.destroyById() instead.
                    "::destroyById::Canteen::sections": {
                        url: urlBase + "/mensa/canteens/:id/sections/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use Canteen.sections.updateById() instead.
                    "::updateById::Canteen::sections": {
                        url: urlBase + "/mensa/canteens/:id/sections/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use Canteen.sections() instead.
                    "::get::Canteen::sections": {
                        url: urlBase + "/mensa/canteens/:id/sections",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use Canteen.sections.create() instead.
                    "::create::Canteen::sections": {
                        url: urlBase + "/mensa/canteens/:id/sections",
                        method: "POST"
                    },

                    // INTERNAL. Use Canteen.sections.destroyAll() instead.
                    "::delete::Canteen::sections": {
                        url: urlBase + "/mensa/canteens/:id/sections",
                        method: "DELETE"
                    },

                    // INTERNAL. Use Canteen.sections.count() instead.
                    "::count::Canteen::sections": {
                        url: urlBase + "/mensa/canteens/:id/sections/count",
                        method: "GET"
                    },

                    // INTERNAL. Use CanteenDailyMenu.section() instead.
                    "::get::CanteenDailyMenu::section": {
                        url: urlBase + "/mensa/daily-menus/:id/section",
                        method: "GET"
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.CanteenSection#updateOrCreate
             * @methodOf lbServices.CanteenSection
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenSection` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.CanteenSection#update
             * @methodOf lbServices.CanteenSection
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.CanteenSection#destroyById
             * @methodOf lbServices.CanteenSection
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.CanteenSection#removeById
             * @methodOf lbServices.CanteenSection
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.CanteenSection#modelName
             * @propertyOf lbServices.CanteenSection
             * @description
             * The name of the model represented by this $resource,
             * i.e. `CanteenSection`.
             */
            R.modelName = "CanteenSection";


            /**
             * @ngdoc method
             * @name lbServices.CanteenSection#canteen
             * @methodOf lbServices.CanteenSection
             *
             * @description
             *
             * Fetches belongsTo relation canteen
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Canteen` object.)
             * </em>
             */
            R.canteen = function () {
                var TargetResource = $injector.get("Canteen");
                var action = TargetResource["::get::CanteenSection::canteen"];
                return action.apply(R, arguments);
            };
            /**
             * @ngdoc object
             * @name lbServices.CanteenSection.menus
             * @header lbServices.CanteenSection.menus
             * @object
             * @description
             *
             * The object `CanteenSection.menus` groups methods
             * manipulating `CanteenDailyMenu` instances related to `CanteenSection`.
             *
             * Call {@link lbServices.CanteenSection#menus CanteenSection.menus()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.CanteenSection#menus
             * @methodOf lbServices.CanteenSection
             *
             * @description
             *
             * Queries menus of CanteenSection.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R.menus = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::get::CanteenSection::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenSection.menus#count
             * @methodOf lbServices.CanteenSection.menus
             *
             * @description
             *
             * Counts menus of CanteenSection.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.menus.count = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::count::CanteenSection::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenSection.menus#create
             * @methodOf lbServices.CanteenSection.menus
             *
             * @description
             *
             * Creates a new instance in menus of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R.menus.create = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::create::CanteenSection::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenSection.menus#destroyAll
             * @methodOf lbServices.CanteenSection.menus
             *
             * @description
             *
             * Deletes all menus of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.menus.destroyAll = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::delete::CanteenSection::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenSection.menus#destroyById
             * @methodOf lbServices.CanteenSection.menus
             *
             * @description
             *
             * Delete a related item by id for menus
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for menus
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.menus.destroyById = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::destroyById::CanteenSection::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenSection.menus#findById
             * @methodOf lbServices.CanteenSection.menus
             *
             * @description
             *
             * Find a related item by id for menus
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for menus
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R.menus.findById = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::findById::CanteenSection::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenSection.menus#updateById
             * @methodOf lbServices.CanteenSection.menus
             *
             * @description
             *
             * Update a related item by id for menus
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for menus
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R.menus.updateById = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::updateById::CanteenSection::menus"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.CanteenDailyMenu
     * @header lbServices.CanteenDailyMenu
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `CanteenDailyMenu` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "CanteenDailyMenu",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/mensa/daily-menus/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use CanteenDailyMenu.section() instead.
                    "prototype$__get__section": {
                        url: urlBase + "/mensa/daily-menus/:id/section",
                        method: "GET"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.findById() instead.
                    "prototype$__findById__meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.destroyById() instead.
                    "prototype$__destroyById__meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.updateById() instead.
                    "prototype$__updateById__meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.link() instead.
                    "prototype$__link__meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/rel/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.unlink() instead.
                    "prototype$__unlink__meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/rel/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.exists() instead.
                    "prototype$__exists__meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/rel/:fk",
                        method: "HEAD"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals() instead.
                    "prototype$__get__meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.create() instead.
                    "prototype$__create__meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals",
                        method: "POST"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.destroyAll() instead.
                    "prototype$__delete__meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.count() instead.
                    "prototype$__count__meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenDailyMenu#create
                     * @methodOf lbServices.CanteenDailyMenu
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenDailyMenu` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/mensa/daily-menus",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenDailyMenu#upsert
                     * @methodOf lbServices.CanteenDailyMenu
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenDailyMenu` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/mensa/daily-menus",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenDailyMenu#exists
                     * @methodOf lbServices.CanteenDailyMenu
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/mensa/daily-menus/:id/exists",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenDailyMenu#findById
                     * @methodOf lbServices.CanteenDailyMenu
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenDailyMenu` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/mensa/daily-menus/:id",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenDailyMenu#find
                     * @methodOf lbServices.CanteenDailyMenu
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenDailyMenu` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/mensa/daily-menus",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenDailyMenu#findOne
                     * @methodOf lbServices.CanteenDailyMenu
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenDailyMenu` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/mensa/daily-menus/findOne",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenDailyMenu#updateAll
                     * @methodOf lbServices.CanteenDailyMenu
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/mensa/daily-menus/update",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenDailyMenu#deleteById
                     * @methodOf lbServices.CanteenDailyMenu
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/mensa/daily-menus/:id",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenDailyMenu#count
                     * @methodOf lbServices.CanteenDailyMenu
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/mensa/daily-menus/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenDailyMenu#prototype$updateAttributes
                     * @methodOf lbServices.CanteenDailyMenu
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - PersistedModel id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenDailyMenu` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/mensa/daily-menus/:id",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenSection.menus.findById() instead.
                    "::findById::CanteenSection::menus": {
                        url: urlBase + "/mensa/sections/:id/menus/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use CanteenSection.menus.destroyById() instead.
                    "::destroyById::CanteenSection::menus": {
                        url: urlBase + "/mensa/sections/:id/menus/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenSection.menus.updateById() instead.
                    "::updateById::CanteenSection::menus": {
                        url: urlBase + "/mensa/sections/:id/menus/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenSection.menus() instead.
                    "::get::CanteenSection::menus": {
                        url: urlBase + "/mensa/sections/:id/menus",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use CanteenSection.menus.create() instead.
                    "::create::CanteenSection::menus": {
                        url: urlBase + "/mensa/sections/:id/menus",
                        method: "POST"
                    },

                    // INTERNAL. Use CanteenSection.menus.destroyAll() instead.
                    "::delete::CanteenSection::menus": {
                        url: urlBase + "/mensa/sections/:id/menus",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenSection.menus.count() instead.
                    "::count::CanteenSection::menus": {
                        url: urlBase + "/mensa/sections/:id/menus/count",
                        method: "GET"
                    },

                    // INTERNAL. Use CanteenMeal.menus.findById() instead.
                    "::findById::CanteenMeal::menus": {
                        url: urlBase + "/mensa/meals/:id/menus/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use CanteenMeal.menus.destroyById() instead.
                    "::destroyById::CanteenMeal::menus": {
                        url: urlBase + "/mensa/meals/:id/menus/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenMeal.menus.updateById() instead.
                    "::updateById::CanteenMeal::menus": {
                        url: urlBase + "/mensa/meals/:id/menus/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenMeal.menus.link() instead.
                    "::link::CanteenMeal::menus": {
                        url: urlBase + "/mensa/meals/:id/menus/rel/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenMeal.menus.unlink() instead.
                    "::unlink::CanteenMeal::menus": {
                        url: urlBase + "/mensa/meals/:id/menus/rel/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenMeal.menus.exists() instead.
                    "::exists::CanteenMeal::menus": {
                        url: urlBase + "/mensa/meals/:id/menus/rel/:fk",
                        method: "HEAD"
                    },

                    // INTERNAL. Use CanteenMeal.menus() instead.
                    "::get::CanteenMeal::menus": {
                        url: urlBase + "/mensa/meals/:id/menus",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use CanteenMeal.menus.create() instead.
                    "::create::CanteenMeal::menus": {
                        url: urlBase + "/mensa/meals/:id/menus",
                        method: "POST"
                    },

                    // INTERNAL. Use CanteenMeal.menus.destroyAll() instead.
                    "::delete::CanteenMeal::menus": {
                        url: urlBase + "/mensa/meals/:id/menus",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenMeal.menus.count() instead.
                    "::count::CanteenMeal::menus": {
                        url: urlBase + "/mensa/meals/:id/menus/count",
                        method: "GET"
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu#updateOrCreate
             * @methodOf lbServices.CanteenDailyMenu
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu#update
             * @methodOf lbServices.CanteenDailyMenu
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu#destroyById
             * @methodOf lbServices.CanteenDailyMenu
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu#removeById
             * @methodOf lbServices.CanteenDailyMenu
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.CanteenDailyMenu#modelName
             * @propertyOf lbServices.CanteenDailyMenu
             * @description
             * The name of the model represented by this $resource,
             * i.e. `CanteenDailyMenu`.
             */
            R.modelName = "CanteenDailyMenu";


            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu#section
             * @methodOf lbServices.CanteenDailyMenu
             *
             * @description
             *
             * Fetches belongsTo relation section
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenSection` object.)
             * </em>
             */
            R.section = function () {
                var TargetResource = $injector.get("CanteenSection");
                var action = TargetResource["::get::CanteenDailyMenu::section"];
                return action.apply(R, arguments);
            };
            /**
             * @ngdoc object
             * @name lbServices.CanteenDailyMenu.meals
             * @header lbServices.CanteenDailyMenu.meals
             * @object
             * @description
             *
             * The object `CanteenDailyMenu.meals` groups methods
             * manipulating `CanteenMeal` instances related to `CanteenDailyMenu`.
             *
             * Call {@link lbServices.CanteenDailyMenu#meals CanteenDailyMenu.meals()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu#meals
             * @methodOf lbServices.CanteenDailyMenu
             *
             * @description
             *
             * Queries meals of CanteenDailyMenu.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenMeal` object.)
             * </em>
             */
            R.meals = function () {
                var TargetResource = $injector.get("CanteenMeal");
                var action = TargetResource["::get::CanteenDailyMenu::meals"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu.meals#count
             * @methodOf lbServices.CanteenDailyMenu.meals
             *
             * @description
             *
             * Counts meals of CanteenDailyMenu.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.meals.count = function () {
                var TargetResource = $injector.get("CanteenMeal");
                var action = TargetResource["::count::CanteenDailyMenu::meals"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu.meals#create
             * @methodOf lbServices.CanteenDailyMenu.meals
             *
             * @description
             *
             * Creates a new instance in meals of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenMeal` object.)
             * </em>
             */
            R.meals.create = function () {
                var TargetResource = $injector.get("CanteenMeal");
                var action = TargetResource["::create::CanteenDailyMenu::meals"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu.meals#destroyAll
             * @methodOf lbServices.CanteenDailyMenu.meals
             *
             * @description
             *
             * Deletes all meals of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.meals.destroyAll = function () {
                var TargetResource = $injector.get("CanteenMeal");
                var action = TargetResource["::delete::CanteenDailyMenu::meals"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu.meals#destroyById
             * @methodOf lbServices.CanteenDailyMenu.meals
             *
             * @description
             *
             * Delete a related item by id for meals
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for meals
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.meals.destroyById = function () {
                var TargetResource = $injector.get("CanteenMeal");
                var action = TargetResource["::destroyById::CanteenDailyMenu::meals"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu.meals#exists
             * @methodOf lbServices.CanteenDailyMenu.meals
             *
             * @description
             *
             * Check the existence of meals relation to an item by id
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for meals
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenMeal` object.)
             * </em>
             */
            R.meals.exists = function () {
                var TargetResource = $injector.get("CanteenMeal");
                var action = TargetResource["::exists::CanteenDailyMenu::meals"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu.meals#findById
             * @methodOf lbServices.CanteenDailyMenu.meals
             *
             * @description
             *
             * Find a related item by id for meals
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for meals
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenMeal` object.)
             * </em>
             */
            R.meals.findById = function () {
                var TargetResource = $injector.get("CanteenMeal");
                var action = TargetResource["::findById::CanteenDailyMenu::meals"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu.meals#link
             * @methodOf lbServices.CanteenDailyMenu.meals
             *
             * @description
             *
             * Add a related item by id for meals
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for meals
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenMeal` object.)
             * </em>
             */
            R.meals.link = function () {
                var TargetResource = $injector.get("CanteenMeal");
                var action = TargetResource["::link::CanteenDailyMenu::meals"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu.meals#unlink
             * @methodOf lbServices.CanteenDailyMenu.meals
             *
             * @description
             *
             * Remove the meals relation to an item by id
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for meals
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.meals.unlink = function () {
                var TargetResource = $injector.get("CanteenMeal");
                var action = TargetResource["::unlink::CanteenDailyMenu::meals"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenDailyMenu.meals#updateById
             * @methodOf lbServices.CanteenDailyMenu.meals
             *
             * @description
             *
             * Update a related item by id for meals
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for meals
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenMeal` object.)
             * </em>
             */
            R.meals.updateById = function () {
                var TargetResource = $injector.get("CanteenMeal");
                var action = TargetResource["::updateById::CanteenDailyMenu::meals"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.CanteenMeal
     * @header lbServices.CanteenMeal
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `CanteenMeal` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "CanteenMeal",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/mensa/meals/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use CanteenMeal.menus.findById() instead.
                    "prototype$__findById__menus": {
                        url: urlBase + "/mensa/meals/:id/menus/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use CanteenMeal.menus.destroyById() instead.
                    "prototype$__destroyById__menus": {
                        url: urlBase + "/mensa/meals/:id/menus/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenMeal.menus.updateById() instead.
                    "prototype$__updateById__menus": {
                        url: urlBase + "/mensa/meals/:id/menus/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenMeal.menus.link() instead.
                    "prototype$__link__menus": {
                        url: urlBase + "/mensa/meals/:id/menus/rel/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenMeal.menus.unlink() instead.
                    "prototype$__unlink__menus": {
                        url: urlBase + "/mensa/meals/:id/menus/rel/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenMeal.menus.exists() instead.
                    "prototype$__exists__menus": {
                        url: urlBase + "/mensa/meals/:id/menus/rel/:fk",
                        method: "HEAD"
                    },

                    // INTERNAL. Use CanteenMeal.menus() instead.
                    "prototype$__get__menus": {
                        url: urlBase + "/mensa/meals/:id/menus",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use CanteenMeal.menus.create() instead.
                    "prototype$__create__menus": {
                        url: urlBase + "/mensa/meals/:id/menus",
                        method: "POST"
                    },

                    // INTERNAL. Use CanteenMeal.menus.destroyAll() instead.
                    "prototype$__delete__menus": {
                        url: urlBase + "/mensa/meals/:id/menus",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenMeal.menus.count() instead.
                    "prototype$__count__menus": {
                        url: urlBase + "/mensa/meals/:id/menus/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenMeal#create
                     * @methodOf lbServices.CanteenMeal
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenMeal` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/mensa/meals",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenMeal#upsert
                     * @methodOf lbServices.CanteenMeal
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenMeal` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/mensa/meals",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenMeal#exists
                     * @methodOf lbServices.CanteenMeal
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/mensa/meals/:id/exists",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenMeal#findById
                     * @methodOf lbServices.CanteenMeal
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenMeal` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/mensa/meals/:id",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenMeal#find
                     * @methodOf lbServices.CanteenMeal
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenMeal` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/mensa/meals",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenMeal#findOne
                     * @methodOf lbServices.CanteenMeal
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenMeal` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/mensa/meals/findOne",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenMeal#updateAll
                     * @methodOf lbServices.CanteenMeal
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/mensa/meals/update",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenMeal#deleteById
                     * @methodOf lbServices.CanteenMeal
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/mensa/meals/:id",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenMeal#count
                     * @methodOf lbServices.CanteenMeal
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/mensa/meals/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.CanteenMeal#prototype$updateAttributes
                     * @methodOf lbServices.CanteenMeal
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - PersistedModel id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `CanteenMeal` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/mensa/meals/:id",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.findById() instead.
                    "::findById::CanteenDailyMenu::meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.destroyById() instead.
                    "::destroyById::CanteenDailyMenu::meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.updateById() instead.
                    "::updateById::CanteenDailyMenu::meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.link() instead.
                    "::link::CanteenDailyMenu::meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/rel/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.unlink() instead.
                    "::unlink::CanteenDailyMenu::meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/rel/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.exists() instead.
                    "::exists::CanteenDailyMenu::meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/rel/:fk",
                        method: "HEAD"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals() instead.
                    "::get::CanteenDailyMenu::meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.create() instead.
                    "::create::CanteenDailyMenu::meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals",
                        method: "POST"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.destroyAll() instead.
                    "::delete::CanteenDailyMenu::meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals",
                        method: "DELETE"
                    },

                    // INTERNAL. Use CanteenDailyMenu.meals.count() instead.
                    "::count::CanteenDailyMenu::meals": {
                        url: urlBase + "/mensa/daily-menus/:id/meals/count",
                        method: "GET"
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal#updateOrCreate
             * @methodOf lbServices.CanteenMeal
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenMeal` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal#update
             * @methodOf lbServices.CanteenMeal
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal#destroyById
             * @methodOf lbServices.CanteenMeal
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal#removeById
             * @methodOf lbServices.CanteenMeal
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.CanteenMeal#modelName
             * @propertyOf lbServices.CanteenMeal
             * @description
             * The name of the model represented by this $resource,
             * i.e. `CanteenMeal`.
             */
            R.modelName = "CanteenMeal";

            /**
             * @ngdoc object
             * @name lbServices.CanteenMeal.menus
             * @header lbServices.CanteenMeal.menus
             * @object
             * @description
             *
             * The object `CanteenMeal.menus` groups methods
             * manipulating `CanteenDailyMenu` instances related to `CanteenMeal`.
             *
             * Call {@link lbServices.CanteenMeal#menus CanteenMeal.menus()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal#menus
             * @methodOf lbServices.CanteenMeal
             *
             * @description
             *
             * Queries menus of CanteenMeal.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R.menus = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::get::CanteenMeal::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal.menus#count
             * @methodOf lbServices.CanteenMeal.menus
             *
             * @description
             *
             * Counts menus of CanteenMeal.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.menus.count = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::count::CanteenMeal::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal.menus#create
             * @methodOf lbServices.CanteenMeal.menus
             *
             * @description
             *
             * Creates a new instance in menus of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R.menus.create = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::create::CanteenMeal::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal.menus#destroyAll
             * @methodOf lbServices.CanteenMeal.menus
             *
             * @description
             *
             * Deletes all menus of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.menus.destroyAll = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::delete::CanteenMeal::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal.menus#destroyById
             * @methodOf lbServices.CanteenMeal.menus
             *
             * @description
             *
             * Delete a related item by id for menus
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for menus
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.menus.destroyById = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::destroyById::CanteenMeal::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal.menus#exists
             * @methodOf lbServices.CanteenMeal.menus
             *
             * @description
             *
             * Check the existence of menus relation to an item by id
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for menus
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R.menus.exists = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::exists::CanteenMeal::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal.menus#findById
             * @methodOf lbServices.CanteenMeal.menus
             *
             * @description
             *
             * Find a related item by id for menus
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for menus
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R.menus.findById = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::findById::CanteenMeal::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal.menus#link
             * @methodOf lbServices.CanteenMeal.menus
             *
             * @description
             *
             * Add a related item by id for menus
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for menus
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R.menus.link = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::link::CanteenMeal::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal.menus#unlink
             * @methodOf lbServices.CanteenMeal.menus
             *
             * @description
             *
             * Remove the menus relation to an item by id
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for menus
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.menus.unlink = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::unlink::CanteenMeal::menus"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.CanteenMeal.menus#updateById
             * @methodOf lbServices.CanteenMeal.menus
             *
             * @description
             *
             * Update a related item by id for menus
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for menus
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `CanteenDailyMenu` object.)
             * </em>
             */
            R.menus.updateById = function () {
                var TargetResource = $injector.get("CanteenDailyMenu");
                var action = TargetResource["::updateById::CanteenMeal::menus"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.NewsCategory
     * @header lbServices.NewsCategory
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `NewsCategory` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "NewsCategory",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/news/categories/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use NewsCategory.children.findById() instead.
                    "prototype$__findById__children": {
                        url: urlBase + "/news/categories/:id/children/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsCategory.children.destroyById() instead.
                    "prototype$__destroyById__children": {
                        url: urlBase + "/news/categories/:id/children/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsCategory.children.updateById() instead.
                    "prototype$__updateById__children": {
                        url: urlBase + "/news/categories/:id/children/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsCategory.parent() instead.
                    "prototype$__get__parent": {
                        url: urlBase + "/news/categories/:id/parent",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsCategory.sources.findById() instead.
                    "prototype$__findById__sources": {
                        url: urlBase + "/news/categories/:id/sources/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsCategory.sources.destroyById() instead.
                    "prototype$__destroyById__sources": {
                        url: urlBase + "/news/categories/:id/sources/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsCategory.sources.updateById() instead.
                    "prototype$__updateById__sources": {
                        url: urlBase + "/news/categories/:id/sources/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsCategory.children() instead.
                    "prototype$__get__children": {
                        url: urlBase + "/news/categories/:id/children",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsCategory.children.create() instead.
                    "prototype$__create__children": {
                        url: urlBase + "/news/categories/:id/children",
                        method: "POST"
                    },

                    // INTERNAL. Use NewsCategory.children.destroyAll() instead.
                    "prototype$__delete__children": {
                        url: urlBase + "/news/categories/:id/children",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsCategory.children.count() instead.
                    "prototype$__count__children": {
                        url: urlBase + "/news/categories/:id/children/count",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsCategory.sources() instead.
                    "prototype$__get__sources": {
                        url: urlBase + "/news/categories/:id/sources",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsCategory.sources.create() instead.
                    "prototype$__create__sources": {
                        url: urlBase + "/news/categories/:id/sources",
                        method: "POST"
                    },

                    // INTERNAL. Use NewsCategory.sources.destroyAll() instead.
                    "prototype$__delete__sources": {
                        url: urlBase + "/news/categories/:id/sources",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsCategory.sources.count() instead.
                    "prototype$__count__sources": {
                        url: urlBase + "/news/categories/:id/sources/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#create
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsCategory` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/news/categories",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#upsert
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsCategory` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/news/categories",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#exists
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/news/categories/:id/exists",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#findById
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsCategory` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/news/categories/:id",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#find
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsCategory` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/news/categories",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#findOne
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsCategory` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/news/categories/findOne",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#updateAll
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/news/categories/update",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#deleteById
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/news/categories/:id",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#count
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/news/categories/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#prototype$updateAttributes
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - ImageBase id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsCategory` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/news/categories/:id",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#prototype$getArticles
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - ImageBase id
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsCategory` object.)
                     * </em>
                     */
                    "prototype$getArticles": {
                        url: urlBase + "/news/categories/:id/articles",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsCategory#prototype$getEvents
                     * @methodOf lbServices.NewsCategory
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - ImageBase id
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsCategory` object.)
                     * </em>
                     */
                    "prototype$getEvents": {
                        url: urlBase + "/news/categories/:id/events",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsCategory.children.findById() instead.
                    "::findById::NewsCategory::children": {
                        url: urlBase + "/news/categories/:id/children/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsCategory.children.destroyById() instead.
                    "::destroyById::NewsCategory::children": {
                        url: urlBase + "/news/categories/:id/children/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsCategory.children.updateById() instead.
                    "::updateById::NewsCategory::children": {
                        url: urlBase + "/news/categories/:id/children/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsCategory.parent() instead.
                    "::get::NewsCategory::parent": {
                        url: urlBase + "/news/categories/:id/parent",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsCategory.children() instead.
                    "::get::NewsCategory::children": {
                        url: urlBase + "/news/categories/:id/children",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsCategory.children.create() instead.
                    "::create::NewsCategory::children": {
                        url: urlBase + "/news/categories/:id/children",
                        method: "POST"
                    },

                    // INTERNAL. Use NewsCategory.children.destroyAll() instead.
                    "::delete::NewsCategory::children": {
                        url: urlBase + "/news/categories/:id/children",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsCategory.children.count() instead.
                    "::count::NewsCategory::children": {
                        url: urlBase + "/news/categories/:id/children/count",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsSource.category() instead.
                    "::get::NewsSource::category": {
                        url: urlBase + "/news/sources/:id/category",
                        method: "GET"
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.NewsCategory#updateOrCreate
             * @methodOf lbServices.NewsCategory
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsCategory` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory#update
             * @methodOf lbServices.NewsCategory
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory#destroyById
             * @methodOf lbServices.NewsCategory
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory#removeById
             * @methodOf lbServices.NewsCategory
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.NewsCategory#modelName
             * @propertyOf lbServices.NewsCategory
             * @description
             * The name of the model represented by this $resource,
             * i.e. `NewsCategory`.
             */
            R.modelName = "NewsCategory";

            /**
             * @ngdoc object
             * @name lbServices.NewsCategory.children
             * @header lbServices.NewsCategory.children
             * @object
             * @description
             *
             * The object `NewsCategory.children` groups methods
             * manipulating `NewsCategory` instances related to `NewsCategory`.
             *
             * Call {@link lbServices.NewsCategory#children NewsCategory.children()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.NewsCategory#children
             * @methodOf lbServices.NewsCategory
             *
             * @description
             *
             * Queries children of NewsCategory.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsCategory` object.)
             * </em>
             */
            R.children = function () {
                var TargetResource = $injector.get("NewsCategory");
                var action = TargetResource["::get::NewsCategory::children"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.children#count
             * @methodOf lbServices.NewsCategory.children
             *
             * @description
             *
             * Counts children of NewsCategory.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.children.count = function () {
                var TargetResource = $injector.get("NewsCategory");
                var action = TargetResource["::count::NewsCategory::children"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.children#create
             * @methodOf lbServices.NewsCategory.children
             *
             * @description
             *
             * Creates a new instance in children of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsCategory` object.)
             * </em>
             */
            R.children.create = function () {
                var TargetResource = $injector.get("NewsCategory");
                var action = TargetResource["::create::NewsCategory::children"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.children#destroyAll
             * @methodOf lbServices.NewsCategory.children
             *
             * @description
             *
             * Deletes all children of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.children.destroyAll = function () {
                var TargetResource = $injector.get("NewsCategory");
                var action = TargetResource["::delete::NewsCategory::children"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.children#destroyById
             * @methodOf lbServices.NewsCategory.children
             *
             * @description
             *
             * Delete a related item by id for children
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `fk` – `{*}` - Foreign key for children
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.children.destroyById = function () {
                var TargetResource = $injector.get("NewsCategory");
                var action = TargetResource["::destroyById::NewsCategory::children"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.children#findById
             * @methodOf lbServices.NewsCategory.children
             *
             * @description
             *
             * Find a related item by id for children
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `fk` – `{*}` - Foreign key for children
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsCategory` object.)
             * </em>
             */
            R.children.findById = function () {
                var TargetResource = $injector.get("NewsCategory");
                var action = TargetResource["::findById::NewsCategory::children"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.children#updateById
             * @methodOf lbServices.NewsCategory.children
             *
             * @description
             *
             * Update a related item by id for children
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `fk` – `{*}` - Foreign key for children
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsCategory` object.)
             * </em>
             */
            R.children.updateById = function () {
                var TargetResource = $injector.get("NewsCategory");
                var action = TargetResource["::updateById::NewsCategory::children"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory#parent
             * @methodOf lbServices.NewsCategory
             *
             * @description
             *
             * Fetches belongsTo relation parent
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsCategory` object.)
             * </em>
             */
            R.parent = function () {
                var TargetResource = $injector.get("NewsCategory");
                var action = TargetResource["::get::NewsCategory::parent"];
                return action.apply(R, arguments);
            };
            /**
             * @ngdoc object
             * @name lbServices.NewsCategory.sources
             * @header lbServices.NewsCategory.sources
             * @object
             * @description
             *
             * The object `NewsCategory.sources` groups methods
             * manipulating `NewsSource` instances related to `NewsCategory`.
             *
             * Call {@link lbServices.NewsCategory#sources NewsCategory.sources()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.NewsCategory#sources
             * @methodOf lbServices.NewsCategory
             *
             * @description
             *
             * Queries sources of NewsCategory.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsSource` object.)
             * </em>
             */
            R.sources = function () {
                var TargetResource = $injector.get("NewsSource");
                var action = TargetResource["::get::NewsCategory::sources"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.sources#count
             * @methodOf lbServices.NewsCategory.sources
             *
             * @description
             *
             * Counts sources of NewsCategory.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.sources.count = function () {
                var TargetResource = $injector.get("NewsSource");
                var action = TargetResource["::count::NewsCategory::sources"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.sources#create
             * @methodOf lbServices.NewsCategory.sources
             *
             * @description
             *
             * Creates a new instance in sources of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsSource` object.)
             * </em>
             */
            R.sources.create = function () {
                var TargetResource = $injector.get("NewsSource");
                var action = TargetResource["::create::NewsCategory::sources"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.sources#destroyAll
             * @methodOf lbServices.NewsCategory.sources
             *
             * @description
             *
             * Deletes all sources of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.sources.destroyAll = function () {
                var TargetResource = $injector.get("NewsSource");
                var action = TargetResource["::delete::NewsCategory::sources"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.sources#destroyById
             * @methodOf lbServices.NewsCategory.sources
             *
             * @description
             *
             * Delete a related item by id for sources
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `fk` – `{*}` - Foreign key for sources
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.sources.destroyById = function () {
                var TargetResource = $injector.get("NewsSource");
                var action = TargetResource["::destroyById::NewsCategory::sources"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.sources#findById
             * @methodOf lbServices.NewsCategory.sources
             *
             * @description
             *
             * Find a related item by id for sources
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `fk` – `{*}` - Foreign key for sources
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsSource` object.)
             * </em>
             */
            R.sources.findById = function () {
                var TargetResource = $injector.get("NewsSource");
                var action = TargetResource["::findById::NewsCategory::sources"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsCategory.sources#updateById
             * @methodOf lbServices.NewsCategory.sources
             *
             * @description
             *
             * Update a related item by id for sources
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `fk` – `{*}` - Foreign key for sources
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsSource` object.)
             * </em>
             */
            R.sources.updateById = function () {
                var TargetResource = $injector.get("NewsSource");
                var action = TargetResource["::updateById::NewsCategory::sources"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.NewsSource
     * @header lbServices.NewsSource
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `NewsSource` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "NewsSource",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/news/sources/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use NewsSource.category() instead.
                    "prototype$__get__category": {
                        url: urlBase + "/news/sources/:id/category",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsSource.articles.findById() instead.
                    "prototype$__findById__articles": {
                        url: urlBase + "/news/sources/:id/articles/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsSource.articles.destroyById() instead.
                    "prototype$__destroyById__articles": {
                        url: urlBase + "/news/sources/:id/articles/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.articles.updateById() instead.
                    "prototype$__updateById__articles": {
                        url: urlBase + "/news/sources/:id/articles/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsSource.events.findById() instead.
                    "prototype$__findById__events": {
                        url: urlBase + "/news/sources/:id/events/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsSource.events.destroyById() instead.
                    "prototype$__destroyById__events": {
                        url: urlBase + "/news/sources/:id/events/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.events.updateById() instead.
                    "prototype$__updateById__events": {
                        url: urlBase + "/news/sources/:id/events/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsSource.talks.findById() instead.
                    "prototype$__findById__talks": {
                        url: urlBase + "/news/sources/:id/talks/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsSource.talks.destroyById() instead.
                    "prototype$__destroyById__talks": {
                        url: urlBase + "/news/sources/:id/talks/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.talks.updateById() instead.
                    "prototype$__updateById__talks": {
                        url: urlBase + "/news/sources/:id/talks/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsSource.articles() instead.
                    "prototype$__get__articles": {
                        url: urlBase + "/news/sources/:id/articles",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsSource.articles.create() instead.
                    "prototype$__create__articles": {
                        url: urlBase + "/news/sources/:id/articles",
                        method: "POST"
                    },

                    // INTERNAL. Use NewsSource.articles.destroyAll() instead.
                    "prototype$__delete__articles": {
                        url: urlBase + "/news/sources/:id/articles",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.articles.count() instead.
                    "prototype$__count__articles": {
                        url: urlBase + "/news/sources/:id/articles/count",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsSource.events() instead.
                    "prototype$__get__events": {
                        url: urlBase + "/news/sources/:id/events",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsSource.events.create() instead.
                    "prototype$__create__events": {
                        url: urlBase + "/news/sources/:id/events",
                        method: "POST"
                    },

                    // INTERNAL. Use NewsSource.events.destroyAll() instead.
                    "prototype$__delete__events": {
                        url: urlBase + "/news/sources/:id/events",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.events.count() instead.
                    "prototype$__count__events": {
                        url: urlBase + "/news/sources/:id/events/count",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsSource.talks() instead.
                    "prototype$__get__talks": {
                        url: urlBase + "/news/sources/:id/talks",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsSource.talks.create() instead.
                    "prototype$__create__talks": {
                        url: urlBase + "/news/sources/:id/talks",
                        method: "POST"
                    },

                    // INTERNAL. Use NewsSource.talks.destroyAll() instead.
                    "prototype$__delete__talks": {
                        url: urlBase + "/news/sources/:id/talks",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.talks.count() instead.
                    "prototype$__count__talks": {
                        url: urlBase + "/news/sources/:id/talks/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsSource#create
                     * @methodOf lbServices.NewsSource
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsSource` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/news/sources",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsSource#upsert
                     * @methodOf lbServices.NewsSource
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsSource` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/news/sources",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsSource#exists
                     * @methodOf lbServices.NewsSource
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/news/sources/:id/exists",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsSource#findById
                     * @methodOf lbServices.NewsSource
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsSource` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/news/sources/:id",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsSource#find
                     * @methodOf lbServices.NewsSource
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsSource` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/news/sources",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsSource#findOne
                     * @methodOf lbServices.NewsSource
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsSource` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/news/sources/findOne",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsSource#updateAll
                     * @methodOf lbServices.NewsSource
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/news/sources/update",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsSource#deleteById
                     * @methodOf lbServices.NewsSource
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/news/sources/:id",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsSource#count
                     * @methodOf lbServices.NewsSource
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/news/sources/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsSource#prototype$updateAttributes
                     * @methodOf lbServices.NewsSource
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - PersistedModel id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsSource` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/news/sources/:id",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsCategory.sources.findById() instead.
                    "::findById::NewsCategory::sources": {
                        url: urlBase + "/news/categories/:id/sources/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsCategory.sources.destroyById() instead.
                    "::destroyById::NewsCategory::sources": {
                        url: urlBase + "/news/categories/:id/sources/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsCategory.sources.updateById() instead.
                    "::updateById::NewsCategory::sources": {
                        url: urlBase + "/news/categories/:id/sources/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsCategory.sources() instead.
                    "::get::NewsCategory::sources": {
                        url: urlBase + "/news/categories/:id/sources",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsCategory.sources.create() instead.
                    "::create::NewsCategory::sources": {
                        url: urlBase + "/news/categories/:id/sources",
                        method: "POST"
                    },

                    // INTERNAL. Use NewsCategory.sources.destroyAll() instead.
                    "::delete::NewsCategory::sources": {
                        url: urlBase + "/news/categories/:id/sources",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsCategory.sources.count() instead.
                    "::count::NewsCategory::sources": {
                        url: urlBase + "/news/categories/:id/sources/count",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsArticle.source() instead.
                    "::get::NewsArticle::source": {
                        url: urlBase + "/news/articles/:id/source",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsEvent.source() instead.
                    "::get::NewsEvent::source": {
                        url: urlBase + "/news/events/:id/source",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsTalk.source() instead.
                    "::get::NewsTalk::source": {
                        url: urlBase + "/news/talks/:id/source",
                        method: "GET"
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.NewsSource#updateOrCreate
             * @methodOf lbServices.NewsSource
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsSource` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.NewsSource#update
             * @methodOf lbServices.NewsSource
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.NewsSource#destroyById
             * @methodOf lbServices.NewsSource
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.NewsSource#removeById
             * @methodOf lbServices.NewsSource
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.NewsSource#modelName
             * @propertyOf lbServices.NewsSource
             * @description
             * The name of the model represented by this $resource,
             * i.e. `NewsSource`.
             */
            R.modelName = "NewsSource";


            /**
             * @ngdoc method
             * @name lbServices.NewsSource#category
             * @methodOf lbServices.NewsSource
             *
             * @description
             *
             * Fetches belongsTo relation category
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsCategory` object.)
             * </em>
             */
            R.category = function () {
                var TargetResource = $injector.get("NewsCategory");
                var action = TargetResource["::get::NewsSource::category"];
                return action.apply(R, arguments);
            };
            /**
             * @ngdoc object
             * @name lbServices.NewsSource.articles
             * @header lbServices.NewsSource.articles
             * @object
             * @description
             *
             * The object `NewsSource.articles` groups methods
             * manipulating `NewsArticle` instances related to `NewsSource`.
             *
             * Call {@link lbServices.NewsSource#articles NewsSource.articles()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.NewsSource#articles
             * @methodOf lbServices.NewsSource
             *
             * @description
             *
             * Queries articles of NewsSource.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsArticle` object.)
             * </em>
             */
            R.articles = function () {
                var TargetResource = $injector.get("NewsArticle");
                var action = TargetResource["::get::NewsSource::articles"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.articles#count
             * @methodOf lbServices.NewsSource.articles
             *
             * @description
             *
             * Counts articles of NewsSource.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.articles.count = function () {
                var TargetResource = $injector.get("NewsArticle");
                var action = TargetResource["::count::NewsSource::articles"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.articles#create
             * @methodOf lbServices.NewsSource.articles
             *
             * @description
             *
             * Creates a new instance in articles of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsArticle` object.)
             * </em>
             */
            R.articles.create = function () {
                var TargetResource = $injector.get("NewsArticle");
                var action = TargetResource["::create::NewsSource::articles"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.articles#destroyAll
             * @methodOf lbServices.NewsSource.articles
             *
             * @description
             *
             * Deletes all articles of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.articles.destroyAll = function () {
                var TargetResource = $injector.get("NewsArticle");
                var action = TargetResource["::delete::NewsSource::articles"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.articles#destroyById
             * @methodOf lbServices.NewsSource.articles
             *
             * @description
             *
             * Delete a related item by id for articles
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for articles
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.articles.destroyById = function () {
                var TargetResource = $injector.get("NewsArticle");
                var action = TargetResource["::destroyById::NewsSource::articles"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.articles#findById
             * @methodOf lbServices.NewsSource.articles
             *
             * @description
             *
             * Find a related item by id for articles
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for articles
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsArticle` object.)
             * </em>
             */
            R.articles.findById = function () {
                var TargetResource = $injector.get("NewsArticle");
                var action = TargetResource["::findById::NewsSource::articles"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.articles#updateById
             * @methodOf lbServices.NewsSource.articles
             *
             * @description
             *
             * Update a related item by id for articles
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for articles
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsArticle` object.)
             * </em>
             */
            R.articles.updateById = function () {
                var TargetResource = $injector.get("NewsArticle");
                var action = TargetResource["::updateById::NewsSource::articles"];
                return action.apply(R, arguments);
            };
            /**
             * @ngdoc object
             * @name lbServices.NewsSource.events
             * @header lbServices.NewsSource.events
             * @object
             * @description
             *
             * The object `NewsSource.events` groups methods
             * manipulating `NewsEvent` instances related to `NewsSource`.
             *
             * Call {@link lbServices.NewsSource#events NewsSource.events()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.NewsSource#events
             * @methodOf lbServices.NewsSource
             *
             * @description
             *
             * Queries events of NewsSource.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsEvent` object.)
             * </em>
             */
            R.events = function () {
                var TargetResource = $injector.get("NewsEvent");
                var action = TargetResource["::get::NewsSource::events"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.events#count
             * @methodOf lbServices.NewsSource.events
             *
             * @description
             *
             * Counts events of NewsSource.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.events.count = function () {
                var TargetResource = $injector.get("NewsEvent");
                var action = TargetResource["::count::NewsSource::events"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.events#create
             * @methodOf lbServices.NewsSource.events
             *
             * @description
             *
             * Creates a new instance in events of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsEvent` object.)
             * </em>
             */
            R.events.create = function () {
                var TargetResource = $injector.get("NewsEvent");
                var action = TargetResource["::create::NewsSource::events"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.events#destroyAll
             * @methodOf lbServices.NewsSource.events
             *
             * @description
             *
             * Deletes all events of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.events.destroyAll = function () {
                var TargetResource = $injector.get("NewsEvent");
                var action = TargetResource["::delete::NewsSource::events"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.events#destroyById
             * @methodOf lbServices.NewsSource.events
             *
             * @description
             *
             * Delete a related item by id for events
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for events
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.events.destroyById = function () {
                var TargetResource = $injector.get("NewsEvent");
                var action = TargetResource["::destroyById::NewsSource::events"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.events#findById
             * @methodOf lbServices.NewsSource.events
             *
             * @description
             *
             * Find a related item by id for events
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for events
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsEvent` object.)
             * </em>
             */
            R.events.findById = function () {
                var TargetResource = $injector.get("NewsEvent");
                var action = TargetResource["::findById::NewsSource::events"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.events#updateById
             * @methodOf lbServices.NewsSource.events
             *
             * @description
             *
             * Update a related item by id for events
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for events
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsEvent` object.)
             * </em>
             */
            R.events.updateById = function () {
                var TargetResource = $injector.get("NewsEvent");
                var action = TargetResource["::updateById::NewsSource::events"];
                return action.apply(R, arguments);
            };
            /**
             * @ngdoc object
             * @name lbServices.NewsSource.talks
             * @header lbServices.NewsSource.talks
             * @object
             * @description
             *
             * The object `NewsSource.talks` groups methods
             * manipulating `NewsTalk` instances related to `NewsSource`.
             *
             * Call {@link lbServices.NewsSource#talks NewsSource.talks()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.NewsSource#talks
             * @methodOf lbServices.NewsSource
             *
             * @description
             *
             * Queries talks of NewsSource.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsTalk` object.)
             * </em>
             */
            R.talks = function () {
                var TargetResource = $injector.get("NewsTalk");
                var action = TargetResource["::get::NewsSource::talks"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.talks#count
             * @methodOf lbServices.NewsSource.talks
             *
             * @description
             *
             * Counts talks of NewsSource.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.talks.count = function () {
                var TargetResource = $injector.get("NewsTalk");
                var action = TargetResource["::count::NewsSource::talks"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.talks#create
             * @methodOf lbServices.NewsSource.talks
             *
             * @description
             *
             * Creates a new instance in talks of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsTalk` object.)
             * </em>
             */
            R.talks.create = function () {
                var TargetResource = $injector.get("NewsTalk");
                var action = TargetResource["::create::NewsSource::talks"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.talks#destroyAll
             * @methodOf lbServices.NewsSource.talks
             *
             * @description
             *
             * Deletes all talks of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.talks.destroyAll = function () {
                var TargetResource = $injector.get("NewsTalk");
                var action = TargetResource["::delete::NewsSource::talks"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.talks#destroyById
             * @methodOf lbServices.NewsSource.talks
             *
             * @description
             *
             * Delete a related item by id for talks
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for talks
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.talks.destroyById = function () {
                var TargetResource = $injector.get("NewsTalk");
                var action = TargetResource["::destroyById::NewsSource::talks"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.talks#findById
             * @methodOf lbServices.NewsSource.talks
             *
             * @description
             *
             * Find a related item by id for talks
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for talks
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsTalk` object.)
             * </em>
             */
            R.talks.findById = function () {
                var TargetResource = $injector.get("NewsTalk");
                var action = TargetResource["::findById::NewsSource::talks"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.NewsSource.talks#updateById
             * @methodOf lbServices.NewsSource.talks
             *
             * @description
             *
             * Update a related item by id for talks
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for talks
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsTalk` object.)
             * </em>
             */
            R.talks.updateById = function () {
                var TargetResource = $injector.get("NewsTalk");
                var action = TargetResource["::updateById::NewsSource::talks"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.NewsArticle
     * @header lbServices.NewsArticle
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `NewsArticle` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "NewsArticle",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/news/articles/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use NewsArticle.source() instead.
                    "prototype$__get__source": {
                        url: urlBase + "/news/articles/:id/source",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsArticle#create
                     * @methodOf lbServices.NewsArticle
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsArticle` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/news/articles",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsArticle#upsert
                     * @methodOf lbServices.NewsArticle
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsArticle` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/news/articles",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsArticle#exists
                     * @methodOf lbServices.NewsArticle
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/news/articles/:id/exists",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsArticle#findById
                     * @methodOf lbServices.NewsArticle
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsArticle` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/news/articles/:id",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsArticle#find
                     * @methodOf lbServices.NewsArticle
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsArticle` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/news/articles",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsArticle#findOne
                     * @methodOf lbServices.NewsArticle
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsArticle` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/news/articles/findOne",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsArticle#updateAll
                     * @methodOf lbServices.NewsArticle
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/news/articles/update",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsArticle#deleteById
                     * @methodOf lbServices.NewsArticle
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/news/articles/:id",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsArticle#count
                     * @methodOf lbServices.NewsArticle
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/news/articles/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsArticle#prototype$updateAttributes
                     * @methodOf lbServices.NewsArticle
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - ImageBase id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsArticle` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/news/articles/:id",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsSource.articles.findById() instead.
                    "::findById::NewsSource::articles": {
                        url: urlBase + "/news/sources/:id/articles/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsSource.articles.destroyById() instead.
                    "::destroyById::NewsSource::articles": {
                        url: urlBase + "/news/sources/:id/articles/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.articles.updateById() instead.
                    "::updateById::NewsSource::articles": {
                        url: urlBase + "/news/sources/:id/articles/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsSource.articles() instead.
                    "::get::NewsSource::articles": {
                        url: urlBase + "/news/sources/:id/articles",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsSource.articles.create() instead.
                    "::create::NewsSource::articles": {
                        url: urlBase + "/news/sources/:id/articles",
                        method: "POST"
                    },

                    // INTERNAL. Use NewsSource.articles.destroyAll() instead.
                    "::delete::NewsSource::articles": {
                        url: urlBase + "/news/sources/:id/articles",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.articles.count() instead.
                    "::count::NewsSource::articles": {
                        url: urlBase + "/news/sources/:id/articles/count",
                        method: "GET"
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.NewsArticle#updateOrCreate
             * @methodOf lbServices.NewsArticle
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsArticle` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.NewsArticle#update
             * @methodOf lbServices.NewsArticle
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.NewsArticle#destroyById
             * @methodOf lbServices.NewsArticle
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.NewsArticle#removeById
             * @methodOf lbServices.NewsArticle
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.NewsArticle#modelName
             * @propertyOf lbServices.NewsArticle
             * @description
             * The name of the model represented by this $resource,
             * i.e. `NewsArticle`.
             */
            R.modelName = "NewsArticle";


            /**
             * @ngdoc method
             * @name lbServices.NewsArticle#source
             * @methodOf lbServices.NewsArticle
             *
             * @description
             *
             * Fetches belongsTo relation source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ImageBase id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsSource` object.)
             * </em>
             */
            R.source = function () {
                var TargetResource = $injector.get("NewsSource");
                var action = TargetResource["::get::NewsArticle::source"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.NewsEvent
     * @header lbServices.NewsEvent
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `NewsEvent` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "NewsEvent",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/news/events/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use NewsEvent.source() instead.
                    "prototype$__get__source": {
                        url: urlBase + "/news/events/:id/source",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsEvent#create
                     * @methodOf lbServices.NewsEvent
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsEvent` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/news/events",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsEvent#upsert
                     * @methodOf lbServices.NewsEvent
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsEvent` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/news/events",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsEvent#exists
                     * @methodOf lbServices.NewsEvent
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/news/events/:id/exists",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsEvent#findById
                     * @methodOf lbServices.NewsEvent
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsEvent` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/news/events/:id",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsEvent#find
                     * @methodOf lbServices.NewsEvent
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsEvent` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/news/events",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsEvent#findOne
                     * @methodOf lbServices.NewsEvent
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsEvent` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/news/events/findOne",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsEvent#updateAll
                     * @methodOf lbServices.NewsEvent
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/news/events/update",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsEvent#deleteById
                     * @methodOf lbServices.NewsEvent
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/news/events/:id",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsEvent#count
                     * @methodOf lbServices.NewsEvent
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/news/events/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsEvent#prototype$updateAttributes
                     * @methodOf lbServices.NewsEvent
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - NewsArticle id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsEvent` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/news/events/:id",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsSource.events.findById() instead.
                    "::findById::NewsSource::events": {
                        url: urlBase + "/news/sources/:id/events/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsSource.events.destroyById() instead.
                    "::destroyById::NewsSource::events": {
                        url: urlBase + "/news/sources/:id/events/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.events.updateById() instead.
                    "::updateById::NewsSource::events": {
                        url: urlBase + "/news/sources/:id/events/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsSource.events() instead.
                    "::get::NewsSource::events": {
                        url: urlBase + "/news/sources/:id/events",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsSource.events.create() instead.
                    "::create::NewsSource::events": {
                        url: urlBase + "/news/sources/:id/events",
                        method: "POST"
                    },

                    // INTERNAL. Use NewsSource.events.destroyAll() instead.
                    "::delete::NewsSource::events": {
                        url: urlBase + "/news/sources/:id/events",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.events.count() instead.
                    "::count::NewsSource::events": {
                        url: urlBase + "/news/sources/:id/events/count",
                        method: "GET"
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.NewsEvent#updateOrCreate
             * @methodOf lbServices.NewsEvent
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsEvent` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.NewsEvent#update
             * @methodOf lbServices.NewsEvent
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.NewsEvent#destroyById
             * @methodOf lbServices.NewsEvent
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.NewsEvent#removeById
             * @methodOf lbServices.NewsEvent
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.NewsEvent#modelName
             * @propertyOf lbServices.NewsEvent
             * @description
             * The name of the model represented by this $resource,
             * i.e. `NewsEvent`.
             */
            R.modelName = "NewsEvent";


            /**
             * @ngdoc method
             * @name lbServices.NewsEvent#source
             * @methodOf lbServices.NewsEvent
             *
             * @description
             *
             * Fetches belongsTo relation source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - NewsArticle id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsSource` object.)
             * </em>
             */
            R.source = function () {
                var TargetResource = $injector.get("NewsSource");
                var action = TargetResource["::get::NewsEvent::source"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.NewsTalk
     * @header lbServices.NewsTalk
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `NewsTalk` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "NewsTalk",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/news/talks/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use NewsTalk.source() instead.
                    "prototype$__get__source": {
                        url: urlBase + "/news/talks/:id/source",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsTalk#create
                     * @methodOf lbServices.NewsTalk
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsTalk` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/news/talks",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsTalk#upsert
                     * @methodOf lbServices.NewsTalk
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsTalk` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/news/talks",
                        method: "PUT"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsTalk#exists
                     * @methodOf lbServices.NewsTalk
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/news/talks/:id/exists",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsTalk#findById
                     * @methodOf lbServices.NewsTalk
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsTalk` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/news/talks/:id",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsTalk#find
                     * @methodOf lbServices.NewsTalk
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsTalk` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/news/talks",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsTalk#findOne
                     * @methodOf lbServices.NewsTalk
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsTalk` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/news/talks/findOne",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsTalk#updateAll
                     * @methodOf lbServices.NewsTalk
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/news/talks/update",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsTalk#deleteById
                     * @methodOf lbServices.NewsTalk
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/news/talks/:id",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsTalk#count
                     * @methodOf lbServices.NewsTalk
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/news/talks/count",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.NewsTalk#prototype$updateAttributes
                     * @methodOf lbServices.NewsTalk
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - NewsEvent id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `NewsTalk` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/news/talks/:id",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsSource.talks.findById() instead.
                    "::findById::NewsSource::talks": {
                        url: urlBase + "/news/sources/:id/talks/:fk",
                        method: "GET"
                    },

                    // INTERNAL. Use NewsSource.talks.destroyById() instead.
                    "::destroyById::NewsSource::talks": {
                        url: urlBase + "/news/sources/:id/talks/:fk",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.talks.updateById() instead.
                    "::updateById::NewsSource::talks": {
                        url: urlBase + "/news/sources/:id/talks/:fk",
                        method: "PUT"
                    },

                    // INTERNAL. Use NewsSource.talks() instead.
                    "::get::NewsSource::talks": {
                        url: urlBase + "/news/sources/:id/talks",
                        method: "GET",
                        isArray: true
                    },

                    // INTERNAL. Use NewsSource.talks.create() instead.
                    "::create::NewsSource::talks": {
                        url: urlBase + "/news/sources/:id/talks",
                        method: "POST"
                    },

                    // INTERNAL. Use NewsSource.talks.destroyAll() instead.
                    "::delete::NewsSource::talks": {
                        url: urlBase + "/news/sources/:id/talks",
                        method: "DELETE"
                    },

                    // INTERNAL. Use NewsSource.talks.count() instead.
                    "::count::NewsSource::talks": {
                        url: urlBase + "/news/sources/:id/talks/count",
                        method: "GET"
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.NewsTalk#updateOrCreate
             * @methodOf lbServices.NewsTalk
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsTalk` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.NewsTalk#update
             * @methodOf lbServices.NewsTalk
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.NewsTalk#destroyById
             * @methodOf lbServices.NewsTalk
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.NewsTalk#removeById
             * @methodOf lbServices.NewsTalk
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.NewsTalk#modelName
             * @propertyOf lbServices.NewsTalk
             * @description
             * The name of the model represented by this $resource,
             * i.e. `NewsTalk`.
             */
            R.modelName = "NewsTalk";


            /**
             * @ngdoc method
             * @name lbServices.NewsTalk#source
             * @methodOf lbServices.NewsTalk
             *
             * @description
             *
             * Fetches belongsTo relation source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - NewsEvent id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `NewsSource` object.)
             * </em>
             */
            R.source = function () {
                var TargetResource = $injector.get("NewsSource");
                var action = TargetResource["::get::NewsTalk::source"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.Files
     * @header lbServices.Files
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `Files` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "Files",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/Files/:id",
                {'id': '@id'},
                {

                    /**
                     * @ngdoc method
                     * @name lbServices.Files#getContainers
                     * @methodOf lbServices.Files
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Files` object.)
                     * </em>
                     */
                    "getContainers": {
                        url: urlBase + "/Files",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Files#createContainer
                     * @methodOf lbServices.Files
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Files` object.)
                     * </em>
                     */
                    "createContainer": {
                        url: urlBase + "/Files",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Files#destroyContainer
                     * @methodOf lbServices.Files
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `container` – `{string=}` -
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `` – `{undefined=}` -
                     */
                    "destroyContainer": {
                        url: urlBase + "/Files/:container",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Files#getContainer
                     * @methodOf lbServices.Files
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `container` – `{string=}` -
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Files` object.)
                     * </em>
                     */
                    "getContainer": {
                        url: urlBase + "/Files/:container",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Files#getFiles
                     * @methodOf lbServices.Files
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `container` – `{string=}` -
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Files` object.)
                     * </em>
                     */
                    "getFiles": {
                        url: urlBase + "/Files/:container/files",
                        method: "GET",
                        isArray: true
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Files#getFile
                     * @methodOf lbServices.Files
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `container` – `{string=}` -
                     *
                     *  - `file` – `{string=}` -
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Files` object.)
                     * </em>
                     */
                    "getFile": {
                        url: urlBase + "/Files/:container/files/:file",
                        method: "GET"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Files#removeFile
                     * @methodOf lbServices.Files
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `container` – `{string=}` -
                     *
                     *  - `file` – `{string=}` -
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `` – `{undefined=}` -
                     */
                    "removeFile": {
                        url: urlBase + "/Files/:container/files/:file",
                        method: "DELETE"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Files#upload
                     * @methodOf lbServices.Files
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     *  - `req` – `{object=}` -
                     *
                     *  - `res` – `{object=}` -
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `result` – `{object=}` -
                     */
                    "upload": {
                        url: urlBase + "/Files/:container/upload",
                        method: "POST"
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Files#download
                     * @methodOf lbServices.Files
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `container` – `{string=}` -
                     *
                     *  - `file` – `{string=}` -
                     *
                     *  - `res` – `{object=}` -
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "download": {
                        url: urlBase + "/Files/:container/download/:file",
                        method: "GET"
                    }
                }
            );


            /**
             * @ngdoc property
             * @name lbServices.Files#modelName
             * @propertyOf lbServices.Files
             * @description
             * The name of the model represented by this $resource,
             * i.e. `Files`.
             */
            R.modelName = "Files";


            return R;
        }]);


    module
        .factory('LoopBackAuth', function () {
            var props = ['accessTokenId', 'currentUserId'];
            var propsPrefix = '$LoopBack$';

            function LoopBackAuth() {
                var self = this;
                props.forEach(function (name) {
                    self[name] = load(name);
                });
                this.rememberMe = undefined;
                this.currentUserData = null;
            }

            LoopBackAuth.prototype.save = function () {
                var self = this;
                var storage = this.rememberMe ? localStorage : sessionStorage;
                props.forEach(function (name) {
                    save(storage, name, self[name]);
                });
            };

            LoopBackAuth.prototype.setUser = function (accessTokenId, userId, userData) {
                this.accessTokenId = accessTokenId;
                this.currentUserId = userId;
                this.currentUserData = userData;
            }

            LoopBackAuth.prototype.clearUser = function () {
                this.accessTokenId = null;
                this.currentUserId = null;
                this.currentUserData = null;
            }

            LoopBackAuth.prototype.clearStorage = function () {
                props.forEach(function (name) {
                    save(sessionStorage, name, null);
                    save(localStorage, name, null);
                });
            };

            return new LoopBackAuth();

            // Note: LocalStorage converts the value to string
            // We are using empty string as a marker for null/undefined values.
            function save(storage, name, value) {
                var key = propsPrefix + name;
                if (value == null) value = '';
                storage[key] = value;
            }

            function load(name) {
                var key = propsPrefix + name;
                return localStorage[key] || sessionStorage[key] || null;
            }
        })
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
        }])
        .factory('LoopBackAuthRequestInterceptor', ['$q', 'LoopBackAuth',
            function ($q, LoopBackAuth) {
                return {
                    'request': function (config) {

                        // filter out non urlBase requests
                        if (config.url.substr(0, urlBase.length) !== urlBase) {
                            return config;
                        }

                        if (LoopBackAuth.accessTokenId) {
                            config.headers[authHeader] = LoopBackAuth.accessTokenId;
                        } else if (config.__isGetCurrentUser__) {
                            // Return a stub 401 error for User.getCurrent() when
                            // there is no user logged in
                            var res = {
                                body: {error: {status: 401}},
                                status: 401,
                                config: config,
                                headers: function () {
                                    return undefined;
                                }
                            };
                            return $q.reject(res);
                        }
                        return config || $q.when(config);
                    }
                }
            }])

    /**
     * @ngdoc object
     * @name lbServices.LoopBackResourceProvider
     * @header lbServices.LoopBackResourceProvider
     * @description
     * Use `LoopBackResourceProvider` to change the global configuration
     * settings used by all models. Note that the provider is available
     * to Configuration Blocks only, see
     * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
     * for more details.
     *
     * ## Example
     *
     * ```js
     * angular.module('app')
     *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
     * ```
     */
        .provider('LoopBackResource', function LoopBackResourceProvider() {
            /**
             * @ngdoc method
             * @name lbServices.LoopBackResourceProvider#setAuthHeader
             * @methodOf lbServices.LoopBackResourceProvider
             * @param {string} header The header name to use, e.g. `X-Access-Token`
             * @description
             * Configure the REST transport to use a different header for sending
             * the authentication token. It is sent in the `Authorization` header
             * by default.
             */
            this.setAuthHeader = function (header) {
                authHeader = header;
            };

            /**
             * @ngdoc method
             * @name lbServices.LoopBackResourceProvider#setUrlBase
             * @methodOf lbServices.LoopBackResourceProvider
             * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
             * @description
             * Change the URL of the REST API server. By default, the URL provided
             * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
             */
            this.setUrlBase = function (url) {
                urlBase = url;
            };

            this.$get = ['$resource', function ($resource) {
                return function (url, params, actions) {
                    var resource = $resource(url, params, actions);

                    // Angular always calls POST on $save()
                    // This hack is based on
                    // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
                    resource.prototype.$save = function (success, error) {
                        // Fortunately, LoopBack provides a convenient `upsert` method
                        // that exactly fits our needs.
                        var result = resource.upsert.call(this, {}, this, success, error);
                        return result.$promise || result;
                    };
                    return resource;
                };
            }];
        });

})(window, window.angular);
