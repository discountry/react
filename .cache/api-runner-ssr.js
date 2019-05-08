var plugins = [{
      plugin: require('/Users/yubolun/Desktop/react/node_modules/gatsby-plugin-glamor/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/yubolun/Desktop/react/node_modules/gatsby-remark-autolink-headers/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/yubolun/Desktop/react/node_modules/gatsby-plugin-google-analytics/gatsby-ssr.js'),
      options: {"plugins":[],"trackingId":"UA-45453476-6"},
    },{
      plugin: require('/Users/yubolun/Desktop/react/node_modules/gatsby-plugin-feed/gatsby-ssr.js'),
      options: {"plugins":[],"query":"\n         {\n          site {\n            siteMetadata {\n              title: rssFeedTitle\n              description: rssFeedDescription\n              siteUrl\n              site_url: siteUrl\n            }\n          }\n        }","feeds":[{"query":"\n              {\n                  allMarkdownRemark\n                  (limit: 10,\n                  filter: {id: {regex: \"/blog/\"}},\n                  sort: {fields: [fields___date],\n                  order: DESC}) {\n                    edges {\n                      node {\n                        fields {\n                          date\n                          slug\n                        }\n                        frontmatter {\n                          title\n                        }\n                        html\n                      }\n                    }\n                  }\n                }\n            ","output":"/feed.xml"}]},
    },{
      plugin: require('/Users/yubolun/Desktop/react/node_modules/gatsby-plugin-react-helmet/gatsby-ssr.js'),
      options: {"plugins":[]},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  let results = plugins.map(plugin => {
    if (plugin.plugin[api]) {
      const result = plugin.plugin[api](args, plugin.options)
      return result
    }
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
