copy_diff
=========

Take the output of a diff program as an input stream and print modified/new files. If the output option is specified, then modified/new files are copied to specified directory.

**Usage**

```
-h, --help                show usage
-o, --output <directory>  copy modified files to specified directory
```

**files.txt**

```
A new_file
M sub_folder/modified_file
D deleted_file
```

```
$ copy_diff < files.txt
new_file
sub_folder/modified_file

$ copy_diff -o ./modified_files < files.txt
$ ls ./modified_files
new_file
sub_folder/modified_file
```

