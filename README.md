# GTM-Preview-Copy-Tool
Shows a small clipboard icon in the GTM Preview window dataLayer cards when moused-over so that the data can be copied in the following formats:

 - Text (exactly as shown in the card)
 - JSON (creates a valid equivalent JSON object)
 - DL.push (creates an example dataLayer push to output the same data)
 - Excel (tab delimited so that it can be copied into a 2-column Excel table)

Change the copy type by clicking on the Extension icon in the toolbar.

Some known issues:

 - If the Preview Pane loads for a site in an iframe, the clipboard button doesn't appear.
 - The copy type pop-up window looks ugly as s**t.

To Do:

 - Fix the above issues.
 - Make the icon become "enabled" when the extension loads successfully, something which is currently indicated by a console log.
