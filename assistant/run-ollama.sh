#!/usr/bin/env bash

ollama serve &
ollama list
ollama pull llama3:8b
ollama create pardos-assistant -f diag
ollama create pardos-coder -f diag-q