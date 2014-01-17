copy_diff
=========

Take the output of a diff program as an input stream and print modified/new files. If the output option is specified, then modified/new files are copied to specified directory.

**Install**

```
npm install -g copy_diff
```

**Usage**

```
-o, --output <directory>  copy modified files to specified directory
-h, --help                show usage
```

**files.txt**

```
A new_file
M sub_folder/modified_file
D deleted_file
```

**Examples**

```bash
$ copy_diff < files.txt
new_file
sub_folder/modified_file

$ copy_diff -o ./modified_files < files.txt
$ ls ./modified_files
new_file
sub_folder/modified_file
```

**Tip**

You can get `git` to output this information by using the `--name-status` option.

```
$ git --name-status HEAD~4 HEAD | copy_diff
new_file
sub_folder/modified_file
```


