import React from 'react';
import ReactMde from "react-mde";
import * as Showdown from "showdown";
const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

export default function MarkdownEditor({id, label, value, onChange}) {
  const [selectedTab, setSelectedTab] = React.useState("write");
  return (
    <ReactMde
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      generateMarkdownPreview={value =>
        Promise.resolve(converter.makeHtml(value))
      }
    />
  );
}
