"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import "jodit/es2021/jodit.min.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const copyStringToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const facilityMergeFields = [
  "FacilityNumber",
  "FacilityName",
  "Address",
  "MapCategory",
  "Latitude",
  "Longitude",
  "ReceivingPlant",
  "TrunkLine",
  "SiteElevation",
];

const inspectionMergeFields = ["InspectionCompleteDate", "InspectionEventType"];

const createOptionGroupElement = (mergeFields, optionGrouplabel) => {
  const optionGroupElement = document.createElement("optgroup");
  optionGroupElement.setAttribute("label", optionGrouplabel);
  for (let index = 0; index < mergeFields.length; index++) {
    const optionElement = document.createElement("option");
    optionElement.className = "merge-field-select-option";
    optionElement.value = mergeFields[index];
    optionElement.text = mergeFields[index];
    optionGroupElement.appendChild(optionElement);
  }
  return optionGroupElement;
};

const buttons = [
  "undo",
  "redo",
  "|",
  "bold",
  "strikethrough",
  "underline",
  "italic",
  "|",
  "superscript",
  "subscript",
  "|",
  "align",
  "|",
  "ul",
  "ol",
  "outdent",
  "indent",
  "|",
  "font",
  "fontsize",
  "brush",
  "paragraph", // ✅ Dropdown for headings h1–h6
  "|",
  "image",
  "link",
  "table",
  "|",
  "hr",
  "eraser",
  "copyformat",
  "|",
  "fullsize",
  "selectall",
  "print",
  "|",
  "source",
  "|",
  {
    name: "insertMergeField",
    tooltip: "Insert Merge Field",
    iconURL: "/images/merge.png",
    popup: (editor) => {
      function onSelected(e) {
        const mergeField = e.target.value;
        if (mergeField) {
          const html = `{{${mergeField}}}`;
          editor.selection.insertNode(editor.create.inside.fromHTML(html));
        }
      }

      const divElement = editor.create.div("merge-field-popup");

      const labelElement = document.createElement("label");
      labelElement.className = "merge-field-label";
      labelElement.textContent = "Merge field:";
      divElement.appendChild(labelElement);

      const selectElement = document.createElement("select");
      selectElement.className = "merge-field-select";
      selectElement.appendChild(
        createOptionGroupElement(facilityMergeFields, "Facility")
      );
      selectElement.appendChild(
        createOptionGroupElement(inspectionMergeFields, "Inspection")
      );
      selectElement.onchange = onSelected;
      divElement.appendChild(selectElement);

      return divElement;
    },
  },
  {
    name: "copyContent",
    tooltip: "Copy HTML to Clipboard",
    iconURL: "/images/copy.png",
    exec: (editor) => {
      const html = editor.value;
      copyStringToClipboard(html);
    },
  },
];

const editorConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "medium",
  toolbarAdaptive: true,
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  askBeforePasteHTML: true,
  askBeforePasteFromWord: true,
  buttons: buttons,
  uploader: {
    insertImageAsBase64URI: true,
    imagesExtensions: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
  },
  width: "100%",
  height: 600,
  paragraph: {
    formats: {
      p: "Paragraph",
      h1: "Heading 1",
      h2: "Heading 2",
      h3: "Heading 3",
      h4: "Heading 4",
      h5: "Heading 5", // ✅ now works in dropdown
      h6: "Heading 6", // ✅ now works in dropdown
      blockquote: "Quote",
      code: "Code",
    },
  },
};

// Strips empty paragraphs / <br>-only blocks from the START and END of the HTML.
// These ride in with pasted content and show up as blank space at the top of the
// editor — the space that's awkward to delete by hand.
const stripEdgeEmptyBlocks = (html) => {
  if (!html) return html;
  const head = /^\s*<(p|div|h[1-6])[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>\s*/i;
  const tail = /\s*<(p|div|h[1-6])[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>\s*$/i;
  let out = html;
  while (head.test(out)) out = out.replace(head, "");
  while (tail.test(out)) out = out.replace(tail, "");
  return out;
};

export default function Editor({ content, onChange, height = 600 }) {
  const [showPreview, setShowPreview] = useState(false);

  const togglePreview = () => setShowPreview((prev) => !prev);

  // Capture the Jodit instance so we can clean the leading/trailing blank blocks
  // *inside* the editor — on initial load and right after a paste. Doing it on
  // Jodit's own value keeps React and Jodit in sync (no resync, no cursor jump),
  // and we don't touch it on every keystroke, so blank lines you type stay put.
  const handleEditorRef = useCallback((jodit) => {
    if (!jodit || !jodit.events) return;
    const clean = () => {
      const cur = jodit.value;
      const cleaned = stripEdgeEmptyBlocks(cur);
      if (cleaned !== cur) jodit.value = cleaned;
    };
    jodit.events
      .on("afterInit", () => setTimeout(clean, 0))
      .on("afterPaste", () => setTimeout(clean, 0));
  }, []);

  // IMPORTANT: memoize the config. jodit-react destroys and recreates the whole
  // editor whenever the `config` object reference changes (see its source). A new
  // object on every render = the editor re-initializing on every keystroke.
  const config = useMemo(() => ({ ...editorConfig, height }), [height]);

  // Run the editor UNCONTROLLED. `seedValue` is the HTML we hand to Jodit, and it
  // only changes when `content` arrives from the OUTSIDE (async load on an edit
  // page, or a form reset) — never as an echo of the user's own typing. While the
  // user edits, `seedValue` stays constant, so jodit-react's value-sync effect
  // never re-runs and can never wipe or revert what was typed/deleted.
  const [seedValue, setSeedValue] = useState(content || "");
  const lastEmitted = useRef(content || "");

  useEffect(() => {
    const incoming = content || "";
    if (incoming !== lastEmitted.current) {
      lastEmitted.current = incoming;
      setSeedValue(incoming);
    }
  }, [content]);

  // Forward edits to the parent untouched (for preview/save) and remember what we
  // sent, so the effect above can tell our own echo from a real external change.
  const handleChange = (value) => {
    lastEmitted.current = value;
    onChange(value);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        <JoditEditor
          value={seedValue}
          config={config}
          tabIndex={1}
          editorRef={handleEditorRef}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={togglePreview}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
            showPreview
              ? "bg-gray-700 hover:bg-gray-800 text-white shadow-md"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          }`}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {showPreview && (
        <div className="transition-all duration-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Preview</h2>
          <div
            className="border rounded-xl p-6 bg-gray-50 min-h-[200px] shadow-inner"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </div>
  );
}
