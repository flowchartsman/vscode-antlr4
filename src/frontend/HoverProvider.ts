/*
 * This file is released under the MIT license.
 * Copyright (c) 2016, 2017 Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { TextDocument, Position, CancellationToken, Range, Hover, ProviderResult, HoverProvider } from 'vscode';

import { AntlrFacade } from "../backend/facade";

import { symbolDescriptionFromEnum } from './Symbol';

import * as path from 'path';

export class AntlrHoverProvider implements HoverProvider {
    constructor(private backend: AntlrFacade) { }

    public provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
        let info = this.backend.symbolInfoAtPosition(document.fileName, position.character, position.line + 1, true);
        if (!info) {
            return undefined;
        }

        const description = symbolDescriptionFromEnum(info.kind);
        return new Hover([
            "**" + description + "**\ndefined in: " + path.basename(info.source),
            { language: "antlr", value: (info.definition? info.definition.text : "") }
        ]);
    };
}
