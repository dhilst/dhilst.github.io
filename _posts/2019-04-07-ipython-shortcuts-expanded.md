---
layout: post
title: ipython shortcuts
tags: [python, ipython]
---

# ipython shortcuts

I just copied the shortcuts from the docs, so because the docs page is hidding the descriptions

The orignial can be found here: https://ipython.readthedocs.io/en/6.5.0/config/shortcuts/index.html

<div class="section" id="ipython-shortcuts">
  <h1>IPython shortcuts<a class="headerlink" href="#ipython-shortcuts" title="Permalink to this headline">¶</a></h1>
  <p>Available shortcut in IPython terminal.</p>
  <div class="admonition warning">
    <p class="first admonition-title">Warning</p>
    <p class="last">This list is automatically generated, and may not hold all the available
    shortcut. In particular, it may depends on the version of <code class="docutils literal notranslate"><span class="pre">prompt_toolkit</span></code>
    installed during the generation of this page.</p>
  </div>
  <div class="section" id="single-filtered-shortcuts">
    <h2>Single Filtered shortcuts<a class="headerlink" href="#single-filtered-shortcuts" title="Permalink to this headline">¶</a></h2>
    <div class="wy-table-responsive"><table border="1" class="colwidths-given docutils">
        <colgroup>
          <col width="19%">
          <col width="19%">
          <col width="63%">
        </colgroup>
        <thead valign="bottom">
          <tr class="row-odd"><th class="head">Shortcut</th>
            <th class="head">Filter</th>
            <th class="head">Description</th>
          </tr>
        </thead>
        <tbody valign="top">
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;PageDown&gt;</kbd></td>
            <td>(Not: HasSelection)</td>
            <td>Move <code class="docutils literal notranslate"><span class="pre">forward</span></code> through the history list, fetching the next command</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;PageUp&gt;</kbd></td>
            <td>(Not: HasSelection)</td>
            <td>Move <code class="docutils literal notranslate"><span class="pre">back</span></code> through the history list, fetching the previous command</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Bracketed-Paste&gt;</kbd></td>
            <td>Always</td>
            <td>Pasting from clipboard</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-C&gt;</kbd></td>
            <td>Always</td>
            <td>Abort when Control-C has been pressed</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-Down&gt;</kbd></td>
            <td>Always</td>
            <td>Move <code class="docutils literal notranslate"><span class="pre">forward</span></code> through the history list, fetching the next command</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-L&gt;</kbd></td>
            <td>Always</td>
            <td>Clear the screen and redraw everything at the top of the screen</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-Up&gt;</kbd></td>
            <td>Always</td>
            <td>Move <code class="docutils literal notranslate"><span class="pre">back</span></code> through the history list, fetching the previous command</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-Z&gt;</kbd></td>
            <td>Always</td>
            <td>By default, control-Z should literally insert Ctrl-Z</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Cursor-Position-Response&gt;</kbd></td>
            <td>Always</td>
            <td>Handle incoming Cursor-Position-Request response</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;End&gt;</kbd></td>
            <td>Always</td>
            <td>Move to the end of the line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Home&gt;</kbd></td>
            <td>Always</td>
            <td>Move to the start of the current line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Left&gt;</kbd></td>
            <td>Always</td>
            <td>Move back a character</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Right&gt;</kbd></td>
            <td>Always</td>
            <td>Move forward a character</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Vt100-Mouse-Event&gt;</kbd></td>
            <td>Always</td>
            <td>Handling of incoming mouse event</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Windows-Mouse-Event&gt;</kbd></td>
            <td>Always</td>
            <td>Handling of mouse events for Windows</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Any&gt;</kbd></td>
            <td>Condition</td>
            <td>Handle quoted insert</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-D&gt;</kbd></td>
            <td>Condition</td>
            <td>Exit</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-E&gt;</kbd></td>
            <td>Condition</td>
            <td>Accept suggestion</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-F&gt;</kbd></td>
            <td>Condition</td>
            <td>Accept suggestion</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Right&gt;</kbd></td>
            <td>Condition</td>
            <td>Accept suggestion</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-A&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Move to the start of the current line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-B&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Move back a character</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-E&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Move to the end of the line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-F&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Move forward a character</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-Left&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Move back to the start of the current or previous word</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-N&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Next line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-O&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Accept the current line for execution and fetch the next line relative to the current line from the history for editing</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-P&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Previous line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-Right&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Move forward to the end of the next word</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-Space&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Start of the selection (if the current buffer is not empty)</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-SquareClose&gt; &lt;Any&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>When Ctl-] + a character is pressed</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-X&gt; (</kbd></td>
            <td>EmacsMode</td>
            <td>Begin saving the characters typed into the current keyboard macro</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-X&gt; )</kbd></td>
            <td>EmacsMode</td>
            <td>Stop saving the characters typed into the current keyboard macro and save the definition</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-X&gt; &lt;C-X&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Move cursor back and forth between the start and end of the current line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-X&gt; e</kbd></td>
            <td>EmacsMode</td>
            <td>Re-execute the last keyboard macro defined, by making the characters in the macro appear as if typed at the keyboard</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>By default, ignore escape key</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; &lt;C-SquareClose&gt; &lt;Any&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Like Ctl-], but backwards</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; &lt;Left&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Cursor to start of previous word</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; &lt;Right&gt;</kbd></td>
            <td>EmacsMode</td>
            <td>Cursor to start of next word</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; a</kbd></td>
            <td>EmacsMode</td>
            <td>Previous sentence</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; b</kbd></td>
            <td>EmacsMode</td>
            <td>Move back to the start of the current or previous word</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; e</kbd></td>
            <td>EmacsMode</td>
            <td>Move to end of sentence</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; f</kbd></td>
            <td>EmacsMode</td>
            <td>Move forward to the end of the next word</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">!</kbd></td>
            <td>Never</td>
            <td>‘!’ opens the system prompt</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-B&gt;</kbd></td>
            <td>Never</td>
            <td>Scroll window up</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-D&gt;</kbd></td>
            <td>Never</td>
            <td>Same as ControlF, but only scroll half a page</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-E&gt;</kbd></td>
            <td>Never</td>
            <td>scroll_offset += 1</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-F&gt;</kbd></td>
            <td>Never</td>
            <td>Scroll window down</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-J&gt;</kbd></td>
            <td>Never</td>
            <td>Run system command</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-U&gt;</kbd></td>
            <td>Never</td>
            <td>Same as ControlB, but only scroll half a page</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-V&gt;</kbd></td>
            <td>Never</td>
            <td>Scroll page down</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-X&gt; &lt;C-E&gt;</kbd></td>
            <td>Never</td>
            <td>Invoke an editor on the current command line, and accept the result</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-Y&gt;</kbd></td>
            <td>Never</td>
            <td>scroll_offset -= 1</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-Z&gt;</kbd></td>
            <td>Never</td>
            <td>Suspend process to background</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; !</kbd></td>
            <td>Never</td>
            <td>M-‘!’ opens the system prompt</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; v</kbd></td>
            <td>Never</td>
            <td>Scroll page up</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;PageDown&gt;</kbd></td>
            <td>Never</td>
            <td>Scroll page down</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;PageUp&gt;</kbd></td>
            <td>Never</td>
            <td>Scroll page up</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">v</kbd></td>
            <td>Never</td>
            <td>Invoke an editor on the current command line, and accept the result</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt;</kbd></td>
            <td>ViMode</td>
            <td>Escape goes to vi navigation mode</td>
          </tr>
        </tbody>
      </table></div>
  </div>
  <div class="section" id="multi-filtered-shortcuts">
    <h2>Multi Filtered shortcuts<a class="headerlink" href="#multi-filtered-shortcuts" title="Permalink to this headline">¶</a></h2>
    <div class="wy-table-responsive"><table border="1" class="colwidths-given docutils">
        <colgroup>
          <col width="19%">
          <col width="19%">
          <col width="63%">
        </colgroup>
        <thead valign="bottom">
          <tr class="row-odd"><th class="head">Shortcut</th>
            <th class="head">Filter</th>
            <th class="head">Description</th>
          </tr>
        </thead>
        <tbody valign="top">
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-J&gt;</kbd></td>
            <td>(And: (Not: Condition), Condition)</td>
            <td>Enter, accept input</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-D&gt;</kbd></td>
            <td>(And: Condition, (Or: ViInsertMode, EmacsInsertMode))</td>
            <td>Delete character before the cursor</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-J&gt;</kbd></td>
            <td>(And: Condition, (Or: ViInsertMode, EmacsInsertMode))</td>
            <td>Newline (in case of multiline input</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; -</kbd></td>
            <td>(And: EmacsMode, (Not: HasArg))</td>
            <td>&nbsp;</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-G&gt;</kbd></td>
            <td>(And: EmacsMode, (Not: HasSelection))</td>
            <td>Control + G: Cancel completion menu and validation state</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-Q&gt;</kbd></td>
            <td>(And: EmacsMode, (Not: HasSelection))</td>
            <td>Add the next character typed to the line verbatim</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; &lt;</kbd></td>
            <td>(And: EmacsMode, (Not: HasSelection))</td>
            <td>Move to the first line in the history</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; &gt;</kbd></td>
            <td>(And: EmacsMode, (Not: HasSelection))</td>
            <td>Move to the end of the input history, i</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">-</kbd></td>
            <td>(And: EmacsMode, Condition)</td>
            <td>When ‘-‘ is typed again, after exactly ‘-‘ has been given as an argument, ignore this</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-Delete&gt;</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Kill from point to the end of the current word, or if between words, to the end of the next word</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-Underscore&gt;</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Incremental undo</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-X&gt; &lt;C-U&gt;</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Incremental undo</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-X&gt; r y</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Paste before cursor</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-Y&gt;</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Paste before cursor</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; #</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Without numeric argument, comment all lines</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; *</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td><code class="docutils literal notranslate"><span class="pre">meta-*</span></code>: Insert all possible completions of the preceding text</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; .</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Like <code class="docutils literal notranslate"><span class="pre">yank_nth_arg</span></code>, but if no argument has been given, yank the last word of each line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; /</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>M-/: Complete</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; &lt;Backspace&gt;</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Kills the word before point, using “not a letter nor a digit” as a word boundary</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; &lt;C-H&gt;</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Kills the word before point, using “not a letter nor a digit” as a word boundary</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; &lt;C-Y&gt;</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Insert the first argument of the previous command</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; \</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Delete all spaces and tabs around point</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; _</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Like <code class="docutils literal notranslate"><span class="pre">yank_nth_arg</span></code>, but if no argument has been given, yank the last word of each line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; c</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Capitalize the current (or following) word</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; d</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Kill from point to the end of the current word, or if between words, to the end of the next word</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; l</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Lowercase the current (or following) word</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; t</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Swap the last two words before the cursor</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; u</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Uppercase the current (or following) word</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; y</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode)</td>
            <td>Rotate the kill ring, and yank the new top</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; &lt;C-J&gt;</kbd></td>
            <td>(And: EmacsMode, EmacsInsertMode, Condition)</td>
            <td>Accept the line regardless of where the cursor is</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-C&gt;</kbd></td>
            <td>(And: EmacsMode, HasFocus)</td>
            <td>Abort an incremental search and restore the original line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-G&gt;</kbd></td>
            <td>(And: EmacsMode, HasFocus)</td>
            <td>Abort an incremental search and restore the original line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-J&gt;</kbd></td>
            <td>(And: EmacsMode, HasFocus)</td>
            <td>When enter pressed in isearch, quit isearch mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt;</kbd></td>
            <td>(And: EmacsMode, HasFocus)</td>
            <td>When enter pressed in isearch, quit isearch mode</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-C&gt; &lt;</kbd></td>
            <td>(And: EmacsMode, HasSelection)</td>
            <td>Unindent selected text</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-C&gt; &gt;</kbd></td>
            <td>(And: EmacsMode, HasSelection)</td>
            <td>Indent selected text</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-G&gt;</kbd></td>
            <td>(And: EmacsMode, HasSelection)</td>
            <td>Cancel selection</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-W&gt;</kbd></td>
            <td>(And: EmacsMode, HasSelection)</td>
            <td>Cut selected text</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-X&gt; r k</kbd></td>
            <td>(And: EmacsMode, HasSelection)</td>
            <td>Cut selected text</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt; w</kbd></td>
            <td>(And: EmacsMode, HasSelection)</td>
            <td>Copy selected text</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-R&gt;</kbd></td>
            <td>(And: ViMode, (Not: HasFocus))</td>
            <td>Vi-style backward search</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-S&gt;</kbd></td>
            <td>(And: ViMode, (Not: HasFocus))</td>
            <td>Vi-style forward search</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-K&gt;</kbd></td>
            <td>(And: ViMode, (Or: ViInsertMode, ViReplaceMode))</td>
            <td>Go into digraph mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">z +</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode))</td>
            <td>Scrolls the window to makes the current line the first line in the visible region</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">z -</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode))</td>
            <td>Scrolls the window to makes the current line the last line in the visible region</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">z &lt;C-J&gt;</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode))</td>
            <td>Scrolls the window to makes the current line the first line in the visible region</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">z b</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode))</td>
            <td>Scrolls the window to makes the current line the last line in the visible region</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">z t</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode))</td>
            <td>Scrolls the window to makes the current line the first line in the visible region</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">z z</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode))</td>
            <td>Center Window vertically around cursor</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">/</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode), (Not: Condition))</td>
            <td>Vi-style forward search</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">?</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode), (Not: Condition))</td>
            <td>Vi-style backward search</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">/</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode), Condition)</td>
            <td>Vi-style backward search</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">?</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode), Condition)</td>
            <td>Vi-style forward search</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">0</kbd></td>
            <td>(And: ViMode, (Or: ViNavigationMode, ViSelectionMode, ViWaitingForTextObjectMode), HasArg)</td>
            <td>Zero when an argument was already give</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">I</kbd></td>
            <td>(And: ViMode, Condition, (Not: IsReadOnly))</td>
            <td>Insert in block selection mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">G</kbd></td>
            <td>(And: ViMode, HasArg)</td>
            <td>If an argument is given, move to this line in the history</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-C&gt;</kbd></td>
            <td>(And: ViMode, HasFocus)</td>
            <td>Cancel search</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-J&gt;</kbd></td>
            <td>(And: ViMode, HasFocus)</td>
            <td>Apply the search</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Escape&gt;</kbd></td>
            <td>(And: ViMode, HasFocus)</td>
            <td>Apply the search</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Backspace&gt;</kbd></td>
            <td>(And: ViMode, HasFocus, Condition)</td>
            <td>Cancel search</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-H&gt;</kbd></td>
            <td>(And: ViMode, HasFocus, Condition)</td>
            <td>Cancel search</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Any&gt;</kbd></td>
            <td>(And: ViMode, ViDigraphMode, Condition)</td>
            <td>Insert digraph</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-E&gt;</kbd></td>
            <td>(And: ViMode, ViInsertMode)</td>
            <td>Cancel completion</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-P&gt;</kbd></td>
            <td>(And: ViMode, ViInsertMode)</td>
            <td>Control-P: To previous completion</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-V&gt;</kbd></td>
            <td>(And: ViMode, ViInsertMode)</td>
            <td>Add the next character typed to the line verbatim</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-X&gt; &lt;C-F&gt;</kbd></td>
            <td>(And: ViMode, ViInsertMode)</td>
            <td>Complete file names</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-X&gt; &lt;C-L&gt;</kbd></td>
            <td>(And: ViMode, ViInsertMode)</td>
            <td>Pressing the ControlX - ControlL sequence in Vi mode does line completion based on the other lines in the document and the history</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-Y&gt;</kbd></td>
            <td>(And: ViMode, ViInsertMode)</td>
            <td>Accept current completion</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Any&gt;</kbd></td>
            <td>(And: ViMode, ViInsertMultipleMode)</td>
            <td>Insert data at multiple cursor positions at once</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Backspace&gt;</kbd></td>
            <td>(And: ViMode, ViInsertMultipleMode)</td>
            <td>Backspace, using multiple cursors</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Delete&gt;</kbd></td>
            <td>(And: ViMode, ViInsertMultipleMode)</td>
            <td>Delete, using multiple cursors</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">" &lt;Any&gt; P</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Paste (before) from named register</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">" &lt;Any&gt; p</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Paste from named register</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">#</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Go to previous occurence of this word</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">*</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Go to next occurence of this word</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">+</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Move to first non whitespace of next line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">-</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Move to first non whitespace of previous line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt; &lt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Unindent lines</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Backspace&gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>In navigation-mode, move cursor</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-H&gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>In navigation-mode, move cursor</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-J&gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>In navigation mode, pressing enter will always return the input</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-N&gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Arrow down and Control-N in navigation mode</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-P&gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Arrow up and ControlP in navigation mode go up</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-V&gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Enter block selection mode</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Down&gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Arrow down and Control-N in navigation mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Insert&gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Presing the Insert key</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Up&gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Arrow up and ControlP in navigation mode go up</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&gt; &gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Indent lines</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">N</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Search previous in navigation mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">P</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Paste before</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">R</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Go to ‘replace’-mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">V</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Start lines selection</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">Y</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Yank the whole line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">d d</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Delete line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">j</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Go down, but if we enter a new history entry, go to the start of the line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">k</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Go up, but if we enter a new history entry, move to the start of the line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">n</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Search next in navigation mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">p</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Paste after</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">r &lt;Any&gt;</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Replace single character under cursor</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">v</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Enter character selection mode</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">x</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Delete character</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">y y</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Yank the whole line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">~</kbd></td>
            <td>(And: ViMode, ViNavigationMode)</td>
            <td>Reverse case of current character and move cursor forward</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">C</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td># Change to end of line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">J</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td>Join lines</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">O</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td>Open line above and enter insertion mode</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">S</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td>Change current line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">c c</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td>Change current line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">g J</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td>Join lines without space</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">g U U</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td>Uppercase current line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">g u u</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td>Lowercase current line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">g ~ ~</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td>Swap case of the current line</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">o</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td>Open line below and enter insertion mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">s</kbd></td>
            <td>(And: ViMode, ViNavigationMode, (Not: IsReadOnly))</td>
            <td>Substitute with new text (Delete character(s) and go to insert mode</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Any&gt;</kbd></td>
            <td>(And: ViMode, ViReplaceMode)</td>
            <td>Insert data at cursor position</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-V&gt;</kbd></td>
            <td>(And: ViMode, ViSelectionMode)</td>
            <td>Exit block selection mode, or go from non block selection mode to block selection mode</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">V</kbd></td>
            <td>(And: ViMode, ViSelectionMode)</td>
            <td>Exit line selection mode, or go from non line selection mode to line selection mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">a W</kbd></td>
            <td>(And: ViMode, ViSelectionMode)</td>
            <td>Switch from visual linewise mode to visual characterwise mode</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">a w</kbd></td>
            <td>(And: ViMode, ViSelectionMode)</td>
            <td>Switch from visual linewise mode to visual characterwise mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">j</kbd></td>
            <td>(And: ViMode, ViSelectionMode)</td>
            <td>Arrow down in selection mode</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">k</kbd></td>
            <td>(And: ViMode, ViSelectionMode)</td>
            <td>Arrow up in selection mode</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">v</kbd></td>
            <td>(And: ViMode, ViSelectionMode)</td>
            <td>Exit character selection mode, or go from non-character-selection mode to character selection mode</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">x</kbd></td>
            <td>(And: ViMode, ViSelectionMode)</td>
            <td>Cut selection</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">J</kbd></td>
            <td>(And: ViMode, ViSelectionMode, (Not: IsReadOnly))</td>
            <td>Join selected lines</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">g J</kbd></td>
            <td>(And: ViMode, ViSelectionMode, (Not: IsReadOnly))</td>
            <td>Join selected lines without space</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Any&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Insert yourself</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;BackTab&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Move backward through the list of possible completions</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;Backspace&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Delete the character behind the cursor</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-H&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Delete the character behind the cursor</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-I&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Generate completions, or go to the next completion</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-K&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Kill the text from the cursor to the end of the line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-T&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Emulate Emacs transpose-char behavior: at the beginning of the buffer, do nothing</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;C-U&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Kill backward from the cursor to the beginning of the current line</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;C-W&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Kill the word behind point, using whitespace as a word boundary</td>
          </tr>
          <tr class="row-even"><td><kbd class="kbd docutils literal notranslate">&lt;Delete&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Delete character before the cursor</td>
          </tr>
          <tr class="row-odd"><td><kbd class="kbd docutils literal notranslate">&lt;ShiftDelete&gt;</kbd></td>
            <td>(Or: ViInsertMode, EmacsInsertMode)</td>
            <td>Delete character before the cursor</td>
          </tr>
        </tbody>
      </table></div>
  </div>
</div>
