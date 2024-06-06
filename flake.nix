{

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:

  flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShell = pkgs.mkShell {
        name = "slink";

        buildInputs = with pkgs;[
          nodejs
          # You can set the major version of Node.js to a specific one instead
          # of the default version
          # nodejs-19_x

          # You can choose pnpm, yarn, or none (npm).
          # nodePackages.pnpm

          nodePackages.typescript
          nodePackages.typescript-language-server
          yaml-language-server
          

          tailwindcss-language-server

          prettierd
          vscode-langservers-extracted

          go
          gopls
          openapi-generator-cli
        ];
      };
    }
  );
}
