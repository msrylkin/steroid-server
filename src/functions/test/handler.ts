import { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { analyze } from '@typescript-eslint/scope-manager';
import { middyfy } from "@libs/lambda";
import { parse, simpleTraverse, AST_NODE_TYPES, TSESTree, parseAndGenerateServices, parseWithNodeMaps } from '@typescript-eslint/typescript-estree';
import * as fs from 'fs';
import * as path from 'path';
import { Program, Symbol } from "typescript";

const test: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
    const file = fs.readFileSync('/Users/maxmax/steroid-backend/src/functions/test/exampleService.ts').toString('utf-8');
    console.log('file', file);
    // const ast = parse(file, {
    //     loc: true,
    //     range: true,
    //     // preserveNodeMaps: true,
        
    // });
    const provideParents = false;
    const { ast, services } = parseAndGenerateServices(file, {
        loc: true,
        range: true,
        // preserveNodeMaps: true,
        
    });
    // console.log('ast', esTreeNodeToTSNodeMap.get())

    // return {
    //     statusCode: 200,
    //     body: null,
    // }

    let startLine = 8;
    let startColumn = 25;
    let endLine = null; // 19
    let endColumn = null; // 6
    const variables = []; 

    simpleTraverse(ast, {
        
        enter: function (node) {
            // console.log('\n', analyze(node))
            if (node.type === 'CallExpression' && startLine === node.loc.start.line && startColumn === node.loc.start.column) {
                console.log('found')
                endLine = node.loc.end.line;
                endColumn = node.loc.end.column;
            } else if (
                endLine != null 
                && endColumn != null 
                && startLine <= node.loc?.start?.line 
                && endLine >= node.loc?.end?.line
                && (startLine !== node.loc?.start?.line || startColumn <= node.loc?.start?.column)
                && (endLine !== node.loc?.end?.line || endColumn >= node.loc?.end?.column)
            ) {
                // if ()
                console.log('within')
            }
            console.log(node)
            // console.log(services.esTreeNodeToTSNodeMap.get(node))
            try {
                const checker = services.program.getTypeChecker();
                const tsNode = services.esTreeNodeToTSNodeMap.get(node);
                const typeDeclaration = checker.getTypeAtLocation(tsNode);
                const symbol = typeDeclaration.getSymbol();
                console.log(checker.typeToString(typeDeclaration));
                console.log(tsNode.getSourceFile().fileName.includes("/node_modules/typescript/lib/"))
                console.log(tsNode.getSourceFile().fileName)

                // const symbolAtLoc = checker.getSymbolAtLocation(node);
                // console.log(symbolAtLoc);
                // console.log(typeDeclaration.getSymbol());
                // console.log(symbol && isTypeLocal(symbol, services.program), symbol?.getName());
                // console.log(checker.typeToString(typeDeclaration));
                // console.log(typeDeclaration.getProperties())
                // console.log(isTypeLocal(checker.getSymbolAtLocation(tsNode), services.program));
            } catch (err) {
                console.log('failed')
            }
            console.log('\n')
        }
    }, provideParents)
    // const scope = analyze(ast);
    // console.log(scope)
    
    return {
        statusCode: 200,
        body: null,
    }
}

export const main = middyfy(test);


function isTypeLocal(symbol: Symbol, program: Program) {
    const sourceFile = symbol?.valueDeclaration?.getSourceFile();
    const hasSource = !!sourceFile;
    const isStandardLibrary = hasSource && program.isSourceFileDefaultLibrary(sourceFile!)
    const isExternal = hasSource && program.isSourceFileFromExternalLibrary(sourceFile!);
    const hasDeclaration = !!symbol?.declarations?.[0];
  
    return !(isStandardLibrary || isExternal) && hasDeclaration;
  }