(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{81:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return f})),a.d(t,"metadata",(function(){return g})),a.d(t,"toc",(function(){return h})),a.d(t,"default",(function(){return y}));var n=a(3),r=a(7),i=a(0),l=a.n(i),c=a(89),o=a(90),s=a(83),u=a(75),d=a.n(u);var m=37,b=39;var p=function(e){var t=e.lazy,a=e.block,n=e.defaultValue,r=e.values,c=e.groupId,u=e.className,p=Object(o.a)(),v=p.tabGroupChoices,f=p.setTabGroupChoices,g=Object(i.useState)(n),h=g[0],k=g[1],y=i.Children.toArray(e.children),O=[];if(null!=c){var j=v[c];null!=j&&j!==h&&r.some((function(e){return e.value===j}))&&k(j)}var w=function(e){var t=e.target,a=O.indexOf(t),n=y[a].props.value;k(n),null!=c&&(f(c,n),setTimeout((function(){var e,a,n,r,i,l,c,o;(e=t.getBoundingClientRect(),a=e.top,n=e.left,r=e.bottom,i=e.right,l=window,c=l.innerHeight,o=l.innerWidth,a>=0&&i<=o&&r<=c&&n>=0)||(t.scrollIntoView({block:"center",behavior:"smooth"}),t.classList.add(d.a.tabItemActive),setTimeout((function(){return t.classList.remove(d.a.tabItemActive)}),2e3))}),150))},x=function(e){var t,a;switch(e.keyCode){case b:var n=O.indexOf(e.target)+1;a=O[n]||O[0];break;case m:var r=O.indexOf(e.target)-1;a=O[r]||O[O.length-1]}null===(t=a)||void 0===t||t.focus()};return l.a.createElement("div",{className:"tabs-container"},l.a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:Object(s.a)("tabs",{"tabs--block":a},u)},r.map((function(e){var t=e.value,a=e.label;return l.a.createElement("li",{role:"tab",tabIndex:h===t?0:-1,"aria-selected":h===t,className:Object(s.a)("tabs__item",d.a.tabItem,{"tabs__item--active":h===t}),key:t,ref:function(e){return O.push(e)},onKeyDown:x,onFocus:w,onClick:w},a)}))),t?Object(i.cloneElement)(y.filter((function(e){return e.props.value===h}))[0],{className:"margin-vert--md"}):l.a.createElement("div",{className:"margin-vert--md"},y.map((function(e,t){return Object(i.cloneElement)(e,{key:t,hidden:e.props.value!==h})}))))};var v=function(e){var t=e.children,a=e.hidden,n=e.className;return l.a.createElement("div",{role:"tabpanel",hidden:a,className:n},t)},f={title:"Getting Started",slug:"/"},g={unversionedId:"getting-started",id:"getting-started",isDocsHomePage:!1,title:"Getting Started",description:"Install Sparkle with your package manager of choice:",source:"@site/docs/getting-started.mdx",slug:"/",permalink:"/",editUrl:"https://github.com/elimerl/sparkle/edit/master/docs/docs/getting-started.mdx",version:"current",sidebar:"docs",next:{title:"Syntax",permalink:"/syntax"}},h=[],k={toc:h};function y(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},k,a,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,"Install Sparkle with your package manager of choice:"),Object(c.b)(p,{defaultValue:"npm",values:[{label:"NPM",value:"npm"},{label:"Yarn",value:"yarn"}],mdxType:"Tabs"},Object(c.b)(v,{value:"npm",mdxType:"TabItem"},Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre"},"npm i sparkle-cli -g\n"))),Object(c.b)(v,{value:"yarn",mdxType:"TabItem"},"yarn global add sparkle-cli")))}y.isMDXComponent=!0}}]);