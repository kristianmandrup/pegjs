Start
  = Statements

Statements
  = Statement*

Statement
  = Indent* statement:(S / I) { return statement; }

S
  = "S" EOS {
      return "S";
    }

I
  = "I" EOL ++Indent statements:Statements --Indent { return statements; }
  / "I" EOS { return []; }

Indent "indent"
  = "\t"
 / !__ "  "

__ "white space"
 = " \t"
 / " "

EOS
  = EOL
  / EOF

EOL
  = "\n"

EOF
  = !.